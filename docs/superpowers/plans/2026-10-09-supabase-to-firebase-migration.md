# Supabase to Firebase Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Supabase (Postgres via PostgREST + Storage REST) with Firebase (Firestore + Cloud Storage) as the backend's data layer, with zero changes to the frontend.

**Architecture:** Replace the Supabase PostgREST/Storage REST calls in the single-file Express backend (`backend/src/index.ts`) with Firebase Admin SDK (Firestore only) calls for data, static frontend assets for the 20 already-recovered images, and Cloudinary for future admin uploads — keeping route paths, request/response shapes, and the existing in-memory/file fallback pattern unchanged. (Revised from an earlier Firebase-Storage-based design after discovering Firebase Storage now requires the paid Blaze plan even at zero usage; Firestore itself stays on the free Spark plan.) A one-off Node script restores the downloaded Postgres backup into a throwaway local database, reads it with correct native types, copies the recovered image files into the frontend's `public/` folder, and writes the data into Firestore before the route code is swapped over.

**Tech Stack:** Node.js + Express 4 + TypeScript (existing), `firebase-admin` SDK for Firestore (new), `cloudinary` SDK for uploads (new), Docker + local Postgres + `pg` (one-off migration tooling only, removed after use).

**Spec:** `docs/superpowers/specs/2026-10-09-supabase-to-firebase-migration-design.md`

## Global Constraints

- No route path, request body shape, or response JSON shape may change — the frontend (`src/pages/AdminDashboard.tsx` and public pages) makes zero code changes.
- This backend has no existing test framework (`backend/package.json` has no test runner). Verification in this plan uses the dev server + `curl` against real endpoints, matching the project's existing convention of ad-hoc connectivity scripts (seen in `backend/dist/test_*.js`) rather than introducing a new test framework the codebase doesn't use.
- Firestore collection/field names, exactly as decided in the spec's Data Model Mapping: collections `destinations`, `attractions` (FK field renamed `destinationId`), `tours`, `tourEditions` (FK field renamed `tourId`), `hotels`, `settings` (doc ID = key, field `value`), `tourists`. All other fields keep their original Postgres column names (e.g. `price_val`, `description`, `check_in_date`).
- Firebase credentials delivered via exactly one env var: `FIREBASE_SERVICE_ACCOUNT` (the service account JSON, stringified) — Firestore only, no Firebase Storage. Cloudinary credentials delivered via `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`. No other credential mechanism.
- Never print or commit the actual `ADMIN_API_KEY`/`FIREBASE_SERVICE_ACCOUNT`/`CLOUDINARY_API_SECRET` values anywhere in code, logs, or docs — curl examples in this plan read secrets from the shell environment, never inline them.
- No live-traffic cutover plan needed — the Supabase project is already paused, so there is no concurrent production traffic.

## Review Focus

- **Empty `tourists` collection on first write** — the auto-increment-by-max-id logic used for creating a new tourist must not crash when the collection has zero documents (today's real state). Covered in Task 8.
- **Image URL rewriting correctness** — the 5 rows (1 destination, 4 hotels) that point at the now-dead `https://sahdrcajbflinfhlwgmb.supabase.co/storage/...` URLs must end up pointing at valid, loadable local static-asset paths after migration, not left dangling. Covered in Task 3 (migration script) and spot-checked in Task 11.
- **JSONB fields surviving the transfer as real structures, not strings** — `tours.inclusions`/`exclusions`/`itinerary` must arrive in Firestore as native arrays/maps so the frontend's `.map()` calls over them keep working, not as a stringified JSON blob. Covered in Task 3 and Task 5.
- **Write endpoints must not crash when Firestore is unreachable** — today's code falls back to in-memory data when Supabase is down; the Firestore version must preserve that same resilience (no unhandled exceptions, no 500s on a config problem) rather than being a regression from the current behavior. The `if (firestoreConnected && db) {...} else {...}` pattern is identical across every migrated route; Task 4 Step 5 explicitly verifies the fallback once (disabling `FIREBASE_SERVICE_ACCOUNT` and confirming `/api/destinations` still serves mock data without crashing) and the same unmodified pattern is reused as-is in Tasks 5-9, so it is not re-verified per task.
- **Upload validation surviving the storage-backend swap** — the 5MB size cap, image-extension allowlist, and filename sanitization in `/api/upload` live outside the Supabase-specific code and must remain intact after swapping to Cloudinary. Covered in Task 9.

---

### Task 1: Firebase (Firestore) & Cloudinary bootstrap

**Files:**
- Create: `backend/src/firebase.ts`
- Create: `backend/src/cloudinary.ts`
- Modify: `backend/package.json`
- Modify: `backend/.env` (local only, not committed)
- Create: `backend/.env.example`

**Interfaces:**
- Produces: `db: admin.firestore.Firestore | null`, exported from `backend/src/firebase.ts`. Every Firestore-using task imports this from `./firebase`.
- Produces: `cloudinary` (configured `v2` instance) and `isCloudinaryConfigured(): boolean`, exported from `backend/src/cloudinary.ts`. Task 9 imports these.

- [ ] **Step 1: Create the Firebase project (manual, human action — already done)**

Firestore (Native mode, Spark/free plan) is already created per the earlier setup. No Firebase Storage is needed or used.

Go to Project Settings → Service Accounts → "Generate new private key". This downloads a JSON file — keep it secret, never commit it.

- [ ] **Step 2: Create a Cloudinary account (manual, human action)**

At [cloudinary.com](https://cloudinary.com/), sign up for the free tier (no credit card required). From the Dashboard, note three values: **Cloud Name**, **API Key**, **API Secret**.

- [ ] **Step 3: Add the SDK dependencies**

Edit `backend/package.json`, add to `dependencies`:

```json
"firebase-admin": "^13.0.0",
"cloudinary": "^2.5.0"
```

Run:
```bash
cd backend && npm install
```

- [ ] **Step 4: Create the Firebase init module**

Create `backend/src/firebase.ts`:

```ts
import admin from 'firebase-admin';

let firebaseApp: admin.app.App | null = null;

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

if (serviceAccountJson) {
  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (err: any) {
    console.error('Failed to initialize Firebase Admin SDK:', err.message);
  }
} else {
  console.warn('WARNING: FIREBASE_SERVICE_ACCOUNT is not defined. Firestore is unavailable.');
}

export const db: admin.firestore.Firestore | null = firebaseApp ? admin.firestore(firebaseApp) : null;
```

- [ ] **Step 5: Create the Cloudinary init module**

Create `backend/src/cloudinary.ts`:

```ts
import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
} else {
  console.warn('WARNING: CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET are not fully defined. Uploads will use the local fallback.');
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(cloudName && apiKey && apiSecret);
}

export { cloudinary };
```

- [ ] **Step 6: Add env vars**

In `backend/.env`, add (paste the actual downloaded JSON as a single-line string for `FIREBASE_SERVICE_ACCOUNT`, and your Cloudinary dashboard values for the other three):

```
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
PORT=5000
ADMIN_API_KEY=guru1234
```

(Leave `SUPABASE_URL`/`SUPABASE_KEY`/`DATABASE_URL` in place for now — they're removed in Task 10 once every route no longer needs them.)

Create `backend/.env.example` (this one IS committed, documents required vars without real values):

```
FIREBASE_SERVICE_ACCOUNT=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
PORT=5000
ADMIN_API_KEY=
```

- [ ] **Step 7: Verify both connections**

Create a throwaway check file `backend/scripts/check-firebase.ts`:

```ts
import { db } from '../src/firebase';
import { cloudinary, isCloudinaryConfigured } from '../src/cloudinary';

async function main() {
  if (!db) {
    console.error('FAIL: db is null — check FIREBASE_SERVICE_ACCOUNT');
    process.exit(1);
  }
  await db.collection('__healthcheck').doc('ping').set({ at: new Date().toISOString() });
  const doc = await db.collection('__healthcheck').doc('ping').get();
  console.log('Firestore write/read OK:', doc.data());
  await db.collection('__healthcheck').doc('ping').delete();

  if (!isCloudinaryConfigured()) {
    console.error('FAIL: Cloudinary is not configured — check CLOUDINARY_* env vars');
    process.exit(1);
  }
  const pingResult = await cloudinary.api.ping();
  console.log('Cloudinary ping OK:', pingResult);
}

main().then(() => process.exit(0)).catch(err => { console.error('FAIL:', err.message); process.exit(1); });
```

Run: `cd backend && npx ts-node scripts/check-firebase.ts`
Expected: prints `Firestore write/read OK: { at: '...' }` and `Cloudinary ping OK: { status: 'ok' }`, exits 0.

Delete `backend/scripts/check-firebase.ts` once it passes (one-off check, not needed after this task).

- [ ] **Step 8: Commit**

```bash
cd "D:/My Files/Help_Tourism_Bhutan"
git add backend/package.json backend/package-lock.json backend/src/firebase.ts backend/src/cloudinary.ts backend/.env.example
git commit -m "feat(backend): add Firebase Admin SDK (Firestore) and Cloudinary bootstrap"
```

---

### Task 2: Firestore health-check flag in index.ts

**Files:**
- Modify: `backend/src/index.ts`

**Interfaces:**
- Consumes: `db` from `./firebase` (Task 1).
- Produces: module-level `let firestoreConnected: boolean` and `async function checkFirestore()`, used by every route task (3-9) as the gate replacing `dbConnected`/`supabaseFetch`.

- [ ] **Step 1: Add the import**

In `backend/src/index.ts`, after the existing imports (after line 5, `import path from 'path';`), add:

```ts
import { db } from './firebase';
```

- [ ] **Step 2: Add the health-check flag and function**

Locate the existing block:

```ts
// Helper to check DB health
let dbConnected = false;
const checkDb = async () => {
  try {
    await supabaseFetch('/destinations?select=id&limit=1');
    dbConnected = true;
    console.log("Supabase REST API database connected and verified successfully!");
  } catch (err: any) {
    dbConnected = false;
    console.warn("Supabase REST API connection failed. Server is operating in Mock-Fallback mode. Error:", err.message);
  }
};
checkDb();
```

Immediately after it (leave the above block untouched — it's removed later in Task 10), add:

```ts
// Firestore health check (replaces checkDb/dbConnected route-by-route; see Task 10 cleanup)
let firestoreConnected = false;
const checkFirestore = async () => {
  if (!db) {
    firestoreConnected = false;
    console.warn("Firebase Admin SDK not initialized (missing FIREBASE_SERVICE_ACCOUNT). Firestore-backed routes operate in Mock-Fallback mode.");
    return;
  }
  try {
    await db.collection('destinations').limit(1).get();
    firestoreConnected = true;
    console.log("Firestore connected and verified successfully!");
  } catch (err: any) {
    firestoreConnected = false;
    console.warn("Firestore connection failed. Server is operating in Mock-Fallback mode. Error:", err.message);
  }
};
checkFirestore();
```

- [ ] **Step 3: Verify it runs**

Run: `cd backend && npm run dev`
Expected (with Task 1's env vars in place and a reachable Firebase project): log line `Firestore connected and verified successfully!` alongside the pre-existing `Supabase REST API connection failed...` warning (expected, since Supabase is paused — harmless, removed in Task 10).

- [ ] **Step 4: Commit**

```bash
cd "D:/My Files/Help_Tourism_Bhutan"
git add backend/src/index.ts
git commit -m "feat(backend): add Firestore health check alongside existing Supabase check"
```

---

### Task 3: One-off data + storage migration script

**Files:**
- Create: `backend/scripts/migrate-to-firebase.ts`

**Interfaces:**
- Consumes: `db` from `./firebase` (Task 1); reads `D:\My Files\Help_Tourism_Bhutan\databasedoc\db_cluster.sql` and `databasedoc/sahdrcajbflinfhlwgmb/cms-media/*`.
- Produces: populated Firestore collections (`destinations`, `attractions`, `tours`, `tourEditions`, `hotels`, `settings`, `tourists`) and the 20 recovered image files copied into `public/cms-media/` (frontend static assets) — consumed by Tasks 4-9's manual route verification and Task 11's end-to-end check.

- [ ] **Step 1: Restore the dump into a throwaway local Postgres**

```bash
docker run -d --name migration-pg -e POSTGRES_PASSWORD=postgres -p 5433:5432 postgres:17
# wait until ready (a few seconds)
docker exec migration-pg pg_isready -U postgres
```

Expected: `/var/run/postgresql:5432 - accepting connections`

```bash
psql "postgresql://postgres:postgres@localhost:5433/postgres" -f "D:/My Files/Help_Tourism_Bhutan/databasedoc/db_cluster.sql" -v ON_ERROR_STOP=0
```

This will print errors for Supabase-internal roles/schemas/extensions that don't exist on a vanilla Postgres image (`auth`, `storage`, `realtime`, `supabase_vault`, role ownership statements) — that's expected and harmless; `-v ON_ERROR_STOP=0` lets the restore continue past them. We only need the 7 `public.*` tables, which have no dependency on those other schemas.

Verify the tables you need actually restored:
```bash
psql "postgresql://postgres:postgres@localhost:5433/postgres" -c "SELECT 'destinations', count(*) FROM public.destinations UNION ALL SELECT 'attractions', count(*) FROM public.attractions UNION ALL SELECT 'tours', count(*) FROM public.tours UNION ALL SELECT 'tour_editions', count(*) FROM public.tour_editions UNION ALL SELECT 'hotels', count(*) FROM public.hotels UNION ALL SELECT 'settings', count(*) FROM public.settings UNION ALL SELECT 'tourists', count(*) FROM public.tourists;"
```
Expected: destinations=6, attractions=3, tours=13, tour_editions=4, hotels=4, settings=3, tourists=0.

- [ ] **Step 2: Write the migration script**

Create `backend/scripts/migrate-to-firebase.ts`:

```ts
import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { db } from '../src/firebase';

const LOCAL_PG_CONNECTION = 'postgresql://postgres:postgres@localhost:5433/postgres';
const STORAGE_DIR = path.join(__dirname, '../../databasedoc/sahdrcajbflinfhlwgmb/cms-media');
const FRONTEND_PUBLIC_DIR = path.join(__dirname, '../../public/cms-media');
const SUPABASE_URL_PREFIX = 'https://sahdrcajbflinfhlwgmb.supabase.co/storage/v1/object/public/cms-media/';

async function main() {
  if (!db) {
    throw new Error('Firebase not initialized — check FIREBASE_SERVICE_ACCOUNT env var');
  }

  const pg = new Client({ connectionString: LOCAL_PG_CONNECTION });
  await pg.connect();

  // 1. Copy storage files into the frontend's public folder, build URL rewrite map
  if (!fs.existsSync(FRONTEND_PUBLIC_DIR)) {
    fs.mkdirSync(FRONTEND_PUBLIC_DIR, { recursive: true });
  }
  const urlRewriteMap: Record<string, string> = {};
  const files = fs.readdirSync(STORAGE_DIR);
  for (const filename of files) {
    const srcPath = path.join(STORAGE_DIR, filename);
    const destPath = path.join(FRONTEND_PUBLIC_DIR, filename);
    fs.copyFileSync(srcPath, destPath);
    const newUrl = `/cms-media/${filename}`;
    urlRewriteMap[`${SUPABASE_URL_PREFIX}${filename}`] = newUrl;
    console.log(`Copied ${filename} -> ${newUrl}`);
  }
  console.log(`Copied ${files.length} image files into public/cms-media/.`);

  const rewriteImage = (url: string) => urlRewriteMap[url] || url;

  // 2. destinations
  const destRes = await pg.query('SELECT * FROM public.destinations ORDER BY id');
  const destBatch = db.batch();
  for (const row of destRes.rows) {
    destBatch.set(db.collection('destinations').doc(String(row.id)), {
      id: row.id,
      name: row.name,
      image: rewriteImage(row.image),
      description: row.description,
      price: row.price,
      rating: parseFloat(row.rating),
      location: row.location,
      altitude: row.altitude,
      ideal_stay: row.ideal_stay,
      peak_period: row.peak_period,
      language: row.language,
    });
  }
  await destBatch.commit();
  console.log(`Migrated ${destRes.rows.length} destinations.`);

  // 3. attractions
  const attrRes = await pg.query('SELECT * FROM public.attractions ORDER BY id');
  const attrBatch = db.batch();
  for (const row of attrRes.rows) {
    attrBatch.set(db.collection('attractions').doc(String(row.id)), {
      id: row.id,
      destinationId: row.destination_id,
      name: row.name,
      description: row.description,
      image: rewriteImage(row.image),
    });
  }
  await attrBatch.commit();
  console.log(`Migrated ${attrRes.rows.length} attractions.`);

  // 4. tours
  const toursRes = await pg.query('SELECT * FROM public.tours ORDER BY id');
  const toursBatch = db.batch();
  for (const row of toursRes.rows) {
    toursBatch.set(db.collection('tours').doc(row.id), {
      id: row.id,
      title: row.title,
      duration: row.duration,
      nights: row.nights,
      price: row.price,
      price_val: row.price_val,
      image: rewriteImage(row.image),
      description: row.description,
      category: row.category,
      difficulty: row.difficulty,
      inclusions: row.inclusions,
      exclusions: row.exclusions,
      itinerary: row.itinerary,
    });
  }
  await toursBatch.commit();
  console.log(`Migrated ${toursRes.rows.length} tours.`);

  // 5. tour_editions
  const editionsRes = await pg.query('SELECT * FROM public.tour_editions ORDER BY id');
  const editionsBatch = db.batch();
  for (const row of editionsRes.rows) {
    editionsBatch.set(db.collection('tourEditions').doc(String(row.id)), {
      id: row.id,
      tourId: row.tour_id,
      title: row.title,
      period: row.period,
      price: row.price,
      image: rewriteImage(row.image),
      icon: row.icon,
    });
  }
  await editionsBatch.commit();
  console.log(`Migrated ${editionsRes.rows.length} tour editions.`);

  // 6. hotels
  const hotelsRes = await pg.query('SELECT * FROM public.hotels ORDER BY id');
  const hotelsBatch = db.batch();
  for (const row of hotelsRes.rows) {
    hotelsBatch.set(db.collection('hotels').doc(String(row.id)), {
      id: row.id,
      name: row.name,
      location: row.location,
      image: rewriteImage(row.image),
      rating: parseFloat(row.rating),
      price: row.price,
      description: row.description,
    });
  }
  await hotelsBatch.commit();
  console.log(`Migrated ${hotelsRes.rows.length} hotels.`);

  // 7. settings
  const settingsRes = await pg.query('SELECT * FROM public.settings');
  const settingsBatch = db.batch();
  for (const row of settingsRes.rows) {
    settingsBatch.set(db.collection('settings').doc(row.key), { key: row.key, value: row.value });
  }
  await settingsBatch.commit();
  console.log(`Migrated ${settingsRes.rows.length} settings.`);

  // 8. tourists (empty today, migrated defensively for completeness)
  const touristsRes = await pg.query('SELECT * FROM public.tourists ORDER BY id');
  if (touristsRes.rows.length > 0) {
    const touristsBatch = db.batch();
    for (const row of touristsRes.rows) {
      touristsBatch.set(db.collection('tourists').doc(String(row.id)), {
        id: row.id,
        name: row.name,
        nationality: row.nationality,
        passport_number: row.passport_number,
        email: row.email,
        phone: row.phone,
        tour_name: row.tour_name,
        check_in_date: row.check_in_date,
        check_out_date: row.check_out_date,
        sdf_status: row.sdf_status,
        special_requests: row.special_requests,
      });
    }
    await touristsBatch.commit();
  }
  console.log(`Migrated ${touristsRes.rows.length} tourists.`);

  await pg.end();

  // 9. Verify counts read back from Firestore
  const [d, a, t, e, h, s, tr] = await Promise.all([
    db.collection('destinations').count().get(),
    db.collection('attractions').count().get(),
    db.collection('tours').count().get(),
    db.collection('tourEditions').count().get(),
    db.collection('hotels').count().get(),
    db.collection('settings').count().get(),
    db.collection('tourists').count().get(),
  ]);
  console.log('Firestore verification counts:');
  console.log('destinations:', d.data().count, '(expected 6)');
  console.log('attractions:', a.data().count, '(expected 3)');
  console.log('tours:', t.data().count, '(expected 13)');
  console.log('tourEditions:', e.data().count, '(expected 4)');
  console.log('hotels:', h.data().count, '(expected 4)');
  console.log('settings:', s.data().count, '(expected 3)');
  console.log('tourists:', tr.data().count, `(expected ${touristsRes.rows.length})`);
}

main().then(() => {
  console.log('Migration complete.');
  process.exit(0);
}).catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
```

- [ ] **Step 3: Run the migration**

```bash
cd "D:/My Files/Help_Tourism_Bhutan/backend"
npx ts-node scripts/migrate-to-firebase.ts
```

Expected: 20 "Copied ..." lines, then per-table "Migrated N ..." lines matching 6/3/13/4/4/3/0, then the verification counts block showing every count matching its expected value, then `Migration complete.`, exit code 0.

Also verify the files actually landed in the frontend's public folder:
```bash
ls "D:/My Files/Help_Tourism_Bhutan/public/cms-media" | wc -l
```
Expected: `20`.

- [ ] **Step 4: Spot-check the image URL rewrite**

```bash
npx ts-node -e "import('./src/firebase').then(async ({db}) => { const d = await db!.collection('destinations').doc('6').get(); console.log(d.data()!.image); })"
```

Expected: `/cms-media/<filename>` (destination id 6, Bumthang Valley, was the one pointing at the dead Supabase storage URL per the spec's schema appendix). It must NOT contain `supabase.co`. Also confirm the file is actually servable once the frontend dev server is running later (Task 11).

- [ ] **Step 5: Tear down the throwaway Postgres**

```bash
docker rm -f migration-pg
```

- [ ] **Step 6: Commit**

```bash
cd "D:/My Files/Help_Tourism_Bhutan"
git add backend/scripts/migrate-to-firebase.ts public/cms-media
git commit -m "feat: add Supabase-to-Firestore migration script and recovered CMS images"
```

(The script file itself is deleted in Task 10 once the migration has run — it's one-off tooling, not part of the running app.)

---

### Task 4: Destinations & attractions routes → Firestore

**Files:**
- Modify: `backend/src/index.ts`

**Interfaces:**
- Consumes: `db` (Task 1), `firestoreConnected` (Task 2), populated `destinations`/`attractions` collections (Task 3).

- [ ] **Step 1: Replace the destinations list route**

Find:
```ts
app.get('/api/destinations', async (req, res) => {
  const cacheKey = 'destinations:list';
  const cached = getCache(cacheKey, req);
  if (cached) return res.json(cached);

  if (dbConnected) {
    try {
      const data = await supabaseFetch('/destinations?select=*&order=id.asc');
      const formatted = data.map((d: any) => ({
        ...d,
        rating: parseFloat(d.rating) || d.rating
      }));
      setCache(cacheKey, formatted);
      return res.json(formatted);
    } catch (err: any) {
      console.error("Supabase fetch error for destinations:", err.message);
    }
  }
  res.json(memoryDestinations);
});
```

Replace with:
```ts
app.get('/api/destinations', async (req, res) => {
  const cacheKey = 'destinations:list';
  const cached = getCache(cacheKey, req);
  if (cached) return res.json(cached);

  if (firestoreConnected && db) {
    try {
      const snapshot = await db.collection('destinations').orderBy('id').get();
      const formatted = snapshot.docs.map(doc => {
        const d: any = doc.data();
        return { ...d, rating: parseFloat(d.rating) || d.rating };
      });
      setCache(cacheKey, formatted);
      return res.json(formatted);
    } catch (err: any) {
      console.error("Firestore fetch error for destinations:", err.message);
    }
  }
  res.json(memoryDestinations);
});
```

- [ ] **Step 2: Replace the destination-by-id route**

Find:
```ts
app.get('/api/destinations/:id', async (req, res) => {
  const idStr = req.params.id;
  const id = parseInt(idStr as string);
  const cacheKey = `destinations:${id}`;
  const cached = getCache(cacheKey, req);
  if (cached) return res.json(cached);

  if (dbConnected) {
    try {
      const destList = await supabaseFetch(`/destinations?id=eq.${id}&select=*`);
      if (destList && destList.length > 0) {
        const dest = destList[0];
        dest.rating = parseFloat(dest.rating) || dest.rating;
        const attractions = await supabaseFetch(`/attractions?destination_id=eq.${id}&select=name`);
        const result = {
          ...dest,
          attractions: attractions.map((a: any) => a.name)
        };
        setCache(cacheKey, result);
        return res.json(result);
      }
    } catch (err: any) {
      console.error(`Supabase fetch error for destination ${id}:`, err.message);
    }
  }
  
  const dest = memoryDestinations.find(d => d.id === id);
  if (dest) {
    const attractions = mockAttractions.filter(a => a.destination_id === id).map(a => a.name);
    const result = { ...dest, attractions };
    return res.json(result);
  }
  res.status(404).json({ error: "Destination not found" });
});
```

Replace with:
```ts
app.get('/api/destinations/:id', async (req, res) => {
  const idStr = req.params.id;
  const id = parseInt(idStr as string);
  const cacheKey = `destinations:${id}`;
  const cached = getCache(cacheKey, req);
  if (cached) return res.json(cached);

  if (firestoreConnected && db) {
    try {
      const destDoc = await db.collection('destinations').doc(String(id)).get();
      if (destDoc.exists) {
        const dest: any = destDoc.data();
        dest.rating = parseFloat(dest.rating) || dest.rating;
        const attractionsSnap = await db.collection('attractions').where('destinationId', '==', id).get();
        const result = {
          ...dest,
          attractions: attractionsSnap.docs.map(a => a.data().name)
        };
        setCache(cacheKey, result);
        return res.json(result);
      }
    } catch (err: any) {
      console.error(`Firestore fetch error for destination ${id}:`, err.message);
    }
  }

  const dest = memoryDestinations.find(d => d.id === id);
  if (dest) {
    const attractions = mockAttractions.filter(a => a.destination_id === id).map(a => a.name);
    const result = { ...dest, attractions };
    return res.json(result);
  }
  res.status(404).json({ error: "Destination not found" });
});
```

- [ ] **Step 3: Replace the create/update/delete destination routes**

Find:
```ts
// CREATE Destination
app.post('/api/destinations', authenticateAdmin, async (req, res) => {
  let { id, name, image, description, price, rating, location, altitude, ideal_stay, peak_period, language } = req.body;
  const payload = { id: id ? parseInt(id) : undefined, name, image, description, price, rating: parseFloat(rating) || 4.8, location, altitude, ideal_stay, peak_period, language };
  
  if (dbConnected) {
    try {
      if (!payload.id) {
        const existing = await supabaseFetch('/destinations?select=id&order=id.desc&limit=1');
        payload.id = existing && existing.length > 0 ? existing[0].id + 1 : 1;
      }
      await supabaseFetch('/destinations', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      clearCache('destinations');
      return res.status(201).json(payload);
    } catch (err: any) {
      console.error("Create destination failed on Supabase:", err.message);
      return res.status(500).json({ error: `Database write failed: ${err.message}` });
    }
  }

  if (!payload.id) {
    payload.id = memoryDestinations.length > 0 ? Math.max(...memoryDestinations.map(d => d.id)) + 1 : 1;
  }
  memoryDestinations.push(payload as any);
  clearCache('destinations');
  res.status(201).json(payload);
});

// UPDATE Destination
app.put('/api/destinations/:id', authenticateAdmin, async (req, res) => {
  const id = parseInt(req.params.id as string);
  const { name, image, description, price, rating, location, altitude, ideal_stay, peak_period, language } = req.body;
  const payload = { name, image, description, price, rating: parseFloat(rating) || 4.8, location, altitude, ideal_stay, peak_period, language };

  if (dbConnected) {
    try {
      await supabaseFetch(`/destinations?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      clearCache('destinations');
      return res.json({ id, ...payload });
    } catch (err: any) {
      console.error(`Update destination ${id} failed on Supabase:`, err.message);
      return res.status(500).json({ error: `Database write failed: ${err.message}` });
    }
  }

  const idx = memoryDestinations.findIndex(d => d.id === id);
  if (idx !== -1) {
    memoryDestinations[idx] = { id, ...payload } as any;
  }
  clearCache('destinations');
  res.json({ id, ...payload });
});

// DELETE Destination
app.delete('/api/destinations/:id', authenticateAdmin, async (req, res) => {
  const id = parseInt(req.params.id as string);
  if (dbConnected) {
    try {
      await supabaseFetch(`/destinations?id=eq.${id}`, {
        method: 'DELETE'
      });
      clearCache('destinations');
      return res.json({ message: "Destination deleted successfully", id });
    } catch (err: any) {
      console.error(`Delete destination ${id} failed on Supabase:`, err.message);
      return res.status(500).json({ error: `Database write failed: ${err.message}` });
    }
  }

  memoryDestinations = memoryDestinations.filter(d => d.id !== id);
  clearCache('destinations');
  res.json({ message: "Destination deleted successfully", id });
});
```

Replace with:
```ts
// CREATE Destination
app.post('/api/destinations', authenticateAdmin, async (req, res) => {
  let { id, name, image, description, price, rating, location, altitude, ideal_stay, peak_period, language } = req.body;
  const payload: any = { id: id ? parseInt(id) : undefined, name, image, description, price, rating: parseFloat(rating) || 4.8, location, altitude, ideal_stay, peak_period, language };

  if (firestoreConnected && db) {
    try {
      if (!payload.id) {
        const existingSnap = await db.collection('destinations').orderBy('id', 'desc').limit(1).get();
        payload.id = existingSnap.empty ? 1 : existingSnap.docs[0].data().id + 1;
      }
      await db.collection('destinations').doc(String(payload.id)).set(payload);
      clearCache('destinations');
      return res.status(201).json(payload);
    } catch (err: any) {
      console.error("Create destination failed on Firestore:", err.message);
      return res.status(500).json({ error: `Database write failed: ${err.message}` });
    }
  }

  if (!payload.id) {
    payload.id = memoryDestinations.length > 0 ? Math.max(...memoryDestinations.map(d => d.id)) + 1 : 1;
  }
  memoryDestinations.push(payload as any);
  clearCache('destinations');
  res.status(201).json(payload);
});

// UPDATE Destination
app.put('/api/destinations/:id', authenticateAdmin, async (req, res) => {
  const id = parseInt(req.params.id as string);
  const { name, image, description, price, rating, location, altitude, ideal_stay, peak_period, language } = req.body;
  const payload: any = { id, name, image, description, price, rating: parseFloat(rating) || 4.8, location, altitude, ideal_stay, peak_period, language };

  if (firestoreConnected && db) {
    try {
      await db.collection('destinations').doc(String(id)).set(payload, { merge: true });
      clearCache('destinations');
      return res.json(payload);
    } catch (err: any) {
      console.error(`Update destination ${id} failed on Firestore:`, err.message);
      return res.status(500).json({ error: `Database write failed: ${err.message}` });
    }
  }

  const idx = memoryDestinations.findIndex(d => d.id === id);
  if (idx !== -1) {
    memoryDestinations[idx] = payload as any;
  }
  clearCache('destinations');
  res.json(payload);
});

// DELETE Destination
app.delete('/api/destinations/:id', authenticateAdmin, async (req, res) => {
  const id = parseInt(req.params.id as string);
  if (firestoreConnected && db) {
    try {
      await db.collection('destinations').doc(String(id)).delete();
      clearCache('destinations');
      return res.json({ message: "Destination deleted successfully", id });
    } catch (err: any) {
      console.error(`Delete destination ${id} failed on Firestore:`, err.message);
      return res.status(500).json({ error: `Database write failed: ${err.message}` });
    }
  }

  memoryDestinations = memoryDestinations.filter(d => d.id !== id);
  clearCache('destinations');
  res.json({ message: "Destination deleted successfully", id });
});
```

- [ ] **Step 4: Verify against the real server**

```bash
cd backend && npm run dev
```
In another terminal:
```bash
curl -s http://localhost:5000/api/destinations | head -c 300
curl -s http://localhost:5000/api/destinations/6
```
Expected: the list returns 6 destinations ordered by id; `/api/destinations/6` returns Bumthang Valley with an `attractions` array and an `image` value of `/cms-media/<filename>` (a local static asset path), not a `supabase.co` URL.

```bash
curl -s -X POST http://localhost:5000/api/destinations \
  -H "Authorization: Bearer $ADMIN_API_KEY" -H "Content-Type: application/json" \
  -d '{"name":"Test Place","image":"/x.jpg","description":"d","price":"$1","rating":4.5,"location":"Test"}'
```
Expected: 201 with a new `id` of 7. Then clean up:
```bash
curl -s -X DELETE http://localhost:5000/api/destinations/7 -H "Authorization: Bearer $ADMIN_API_KEY"
```
Expected: `{"message":"Destination deleted successfully","id":7}`.

- [ ] **Step 5: Verify the in-memory fallback still works**

Temporarily rename `FIREBASE_SERVICE_ACCOUNT` in `backend/.env` to `FIREBASE_SERVICE_ACCOUNT_DISABLED`, restart `npm run dev`, then:
```bash
curl -s http://localhost:5000/api/destinations | head -c 200
```
Expected: returns the 6 hardcoded `mockDestinations` (Punakha Dzong first) with no server crash or 500. Restore the env var name afterward and restart.

- [ ] **Step 6: Commit**

```bash
cd "D:/My Files/Help_Tourism_Bhutan"
git add backend/src/index.ts
git commit -m "feat(backend): migrate destinations and attractions routes to Firestore"
```

---

### Task 5: Tours & tour editions routes → Firestore

**Files:**
- Modify: `backend/src/index.ts`

**Interfaces:**
- Consumes: `db`, `firestoreConnected`, populated `tours`/`tourEditions` collections (Task 3).

- [ ] **Step 1: Replace the tours list and editions routes**

Find:
```ts
app.get('/api/tours', async (req, res) => {
  const cacheKey = 'tours:list';
  const cached = getCache(cacheKey, req);
  if (cached) return res.json(cached);

  if (dbConnected) {
    try {
      const data = await supabaseFetch('/tours?select=*');
      // Format backend key 'price_val' to matches frontend 'priceVal' and 'description' to 'desc'
      const formatted = data.map((t: any) => ({
        ...t,
        priceVal: t.price_val,
        desc: t.description
      }));
      setCache(cacheKey, formatted);
      return res.json(formatted);
    } catch (err: any) {
      console.error("Supabase fetch error for tours:", err.message);
    }
  }
  res.json(memoryTours);
});

app.get('/api/tours/editions', async (req, res) => {
  const cacheKey = 'tours:editions';
  const cached = getCache(cacheKey, req);
  if (cached) return res.json(cached);

  if (dbConnected) {
    try {
      const data = await supabaseFetch('/tour_editions?select=*&order=id.asc');
      setCache(cacheKey, data);
      return res.json(data);
    } catch (err: any) {
      console.error("Supabase fetch error for tour editions:", err.message);
    }
  }
  res.json(mockEditions);
});

app.get('/api/tours/:id', async (req, res) => {
  const id = req.params.id;
  const cacheKey = `tours:${id}`;
  const cached = getCache(cacheKey, req);
  if (cached) return res.json(cached);

  if (dbConnected) {
    try {
      const tourList = await supabaseFetch(`/tours?id=eq.${id}&select=*`);
      if (tourList && tourList.length > 0) {
        const tour = tourList[0];
        const result = {
          ...tour,
          priceVal: tour.price_val,
          desc: tour.description
        };
        setCache(cacheKey, result);
        return res.json(result);
      }
    } catch (err: any) {
      console.error(`Supabase fetch error for tour ${id}:`, err.message);
    }
  }
  const tour = mockTours.find(t => t.id === id);
  if (tour) return res.json(tour);
  res.status(404).json({ error: "Tour not found" });
});
```

Replace with:
```ts
app.get('/api/tours', async (req, res) => {
  const cacheKey = 'tours:list';
  const cached = getCache(cacheKey, req);
  if (cached) return res.json(cached);

  if (firestoreConnected && db) {
    try {
      const snapshot = await db.collection('tours').get();
      const formatted = snapshot.docs.map(doc => {
        const t: any = doc.data();
        return { ...t, priceVal: t.price_val, desc: t.description };
      });
      setCache(cacheKey, formatted);
      return res.json(formatted);
    } catch (err: any) {
      console.error("Firestore fetch error for tours:", err.message);
    }
  }
  res.json(memoryTours);
});

app.get('/api/tours/editions', async (req, res) => {
  const cacheKey = 'tours:editions';
  const cached = getCache(cacheKey, req);
  if (cached) return res.json(cached);

  if (firestoreConnected && db) {
    try {
      const snapshot = await db.collection('tourEditions').orderBy('id').get();
      const data = snapshot.docs.map(doc => doc.data());
      setCache(cacheKey, data);
      return res.json(data);
    } catch (err: any) {
      console.error("Firestore fetch error for tour editions:", err.message);
    }
  }
  res.json(mockEditions);
});

app.get('/api/tours/:id', async (req, res) => {
  const id = req.params.id;
  const cacheKey = `tours:${id}`;
  const cached = getCache(cacheKey, req);
  if (cached) return res.json(cached);

  if (firestoreConnected && db) {
    try {
      const tourDoc = await db.collection('tours').doc(id).get();
      if (tourDoc.exists) {
        const tour: any = tourDoc.data();
        const result = { ...tour, priceVal: tour.price_val, desc: tour.description };
        setCache(cacheKey, result);
        return res.json(result);
      }
    } catch (err: any) {
      console.error(`Firestore fetch error for tour ${id}:`, err.message);
    }
  }
  const tour = mockTours.find(t => t.id === id);
  if (tour) return res.json(tour);
  res.status(404).json({ error: "Tour not found" });
});
```

- [ ] **Step 2: Replace the create/update/delete tour routes**

Find:
```ts
// CREATE Tour
app.post('/api/tours', authenticateAdmin, async (req, res) => {
  let { id, title, duration, nights, price, priceVal, image, desc, category, difficulty, inclusions, exclusions, itinerary } = req.body;
  if (!id && title) {
    id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  const payload = {
    id,
    title,
    duration,
    nights: parseInt(nights) || 0,
    price,
    price_val: parseInt(priceVal) || 0,
    image,
    description: desc,
    category,
    difficulty,
    inclusions: Array.isArray(inclusions) ? inclusions : [],
    exclusions: Array.isArray(exclusions) ? exclusions : [],
    itinerary: Array.isArray(itinerary) ? itinerary : []
  };

  if (dbConnected) {
    try {
      await supabaseFetch('/tours', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      clearCache('tours');
      return res.status(201).json({ ...payload, priceVal: payload.price_val, desc: payload.description });
    } catch (err: any) {
      console.error("Create tour failed on Supabase:", err.message);
      return res.status(500).json({ error: `Database write failed: ${err.message}` });
    }
  }

  // Fallback to in-memory
  memoryTours.push({
    ...payload,
    priceVal: payload.price_val,
    desc: payload.description
  } as any);
  clearCache('tours');
  res.status(201).json({ ...payload, priceVal: payload.price_val, desc: payload.description });
});

// UPDATE Tour
app.put('/api/tours/:id', authenticateAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const { title, duration, nights, price, priceVal, image, desc, category, difficulty, inclusions, exclusions, itinerary } = req.body;
    const payload = {
      title,
      duration,
      nights: parseInt(nights) || 0,
      price,
      price_val: parseInt(priceVal) || 0,
      image,
      description: desc,
      category,
      difficulty,
      inclusions: Array.isArray(inclusions) ? inclusions : [],
      exclusions: Array.isArray(exclusions) ? exclusions : [],
      itinerary: Array.isArray(itinerary) ? itinerary : []
    };

    if (dbConnected) {
      try {
        await supabaseFetch(`/tours?id=eq.${id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });
        clearCache('tours');
        return res.json({ id, ...payload, priceVal: payload.price_val, desc: payload.description });
      } catch (err: any) {
        console.error(`Update tour ${id} failed on Supabase:`, err.message);
        return res.status(500).json({ error: `Database write failed: ${err.message}` });
      }
    }

    // Fallback to in-memory
    const idx = memoryTours.findIndex(t => t.id === id);
    if (idx !== -1) {
      memoryTours[idx] = { id, ...payload, priceVal: payload.price_val, desc: payload.description } as any;
    }
    clearCache('tours');
    res.json({ id, ...payload, priceVal: payload.price_val, desc: payload.description });
  } catch (err: any) {
    console.error("Update tour failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE Tour
app.delete('/api/tours/:id', authenticateAdmin, async (req, res) => {
  const id = req.params.id;
  if (dbConnected) {
    try {
      await supabaseFetch(`/tours?id=eq.${id}`, {
        method: 'DELETE'
      });
      clearCache('tours');
      return res.json({ message: "Tour deleted successfully", id });
    } catch (err: any) {
      console.error(`Delete tour ${id} failed on Supabase:`, err.message);
      return res.status(500).json({ error: `Database write failed: ${err.message}` });
    }
  }

  // Fallback to in-memory
  memoryTours = memoryTours.filter(t => t.id !== id);
  clearCache('tours');
  res.json({ message: "Tour deleted successfully", id });
});
```

Replace with:
```ts
// CREATE Tour
app.post('/api/tours', authenticateAdmin, async (req, res) => {
  let { id, title, duration, nights, price, priceVal, image, desc, category, difficulty, inclusions, exclusions, itinerary } = req.body;
  if (!id && title) {
    id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  const payload = {
    id,
    title,
    duration,
    nights: parseInt(nights) || 0,
    price,
    price_val: parseInt(priceVal) || 0,
    image,
    description: desc,
    category,
    difficulty,
    inclusions: Array.isArray(inclusions) ? inclusions : [],
    exclusions: Array.isArray(exclusions) ? exclusions : [],
    itinerary: Array.isArray(itinerary) ? itinerary : []
  };

  if (firestoreConnected && db) {
    try {
      await db.collection('tours').doc(id).set(payload);
      clearCache('tours');
      return res.status(201).json({ ...payload, priceVal: payload.price_val, desc: payload.description });
    } catch (err: any) {
      console.error("Create tour failed on Firestore:", err.message);
      return res.status(500).json({ error: `Database write failed: ${err.message}` });
    }
  }

  // Fallback to in-memory
  memoryTours.push({
    ...payload,
    priceVal: payload.price_val,
    desc: payload.description
  } as any);
  clearCache('tours');
  res.status(201).json({ ...payload, priceVal: payload.price_val, desc: payload.description });
});

// UPDATE Tour
app.put('/api/tours/:id', authenticateAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const { title, duration, nights, price, priceVal, image, desc, category, difficulty, inclusions, exclusions, itinerary } = req.body;
    const payload = {
      title,
      duration,
      nights: parseInt(nights) || 0,
      price,
      price_val: parseInt(priceVal) || 0,
      image,
      description: desc,
      category,
      difficulty,
      inclusions: Array.isArray(inclusions) ? inclusions : [],
      exclusions: Array.isArray(exclusions) ? exclusions : [],
      itinerary: Array.isArray(itinerary) ? itinerary : []
    };

    if (firestoreConnected && db) {
      try {
        await db.collection('tours').doc(id).set(payload, { merge: true });
        clearCache('tours');
        return res.json({ id, ...payload, priceVal: payload.price_val, desc: payload.description });
      } catch (err: any) {
        console.error(`Update tour ${id} failed on Firestore:`, err.message);
        return res.status(500).json({ error: `Database write failed: ${err.message}` });
      }
    }

    // Fallback to in-memory
    const idx = memoryTours.findIndex(t => t.id === id);
    if (idx !== -1) {
      memoryTours[idx] = { id, ...payload, priceVal: payload.price_val, desc: payload.description } as any;
    }
    clearCache('tours');
    res.json({ id, ...payload, priceVal: payload.price_val, desc: payload.description });
  } catch (err: any) {
    console.error("Update tour failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE Tour
app.delete('/api/tours/:id', authenticateAdmin, async (req, res) => {
  const id = req.params.id;
  if (firestoreConnected && db) {
    try {
      await db.collection('tours').doc(id).delete();
      clearCache('tours');
      return res.json({ message: "Tour deleted successfully", id });
    } catch (err: any) {
      console.error(`Delete tour ${id} failed on Firestore:`, err.message);
      return res.status(500).json({ error: `Database write failed: ${err.message}` });
    }
  }

  // Fallback to in-memory
  memoryTours = memoryTours.filter(t => t.id !== id);
  clearCache('tours');
  res.json({ message: "Tour deleted successfully", id });
});
```

- [ ] **Step 3: Verify**

```bash
curl -s http://localhost:5000/api/tours | python -c "import json,sys; d=json.load(sys.stdin); print(len(d), d[0]['id'], type(d[0]['inclusions']), type(d[0]['itinerary']))"
```
Expected: `13 bhutan-highlights <class 'list'> <class 'list'>` — confirming `inclusions`/`itinerary` arrived as real arrays, not JSON strings (Review Focus item 3).

```bash
curl -s http://localhost:5000/api/tours/editions | head -c 200
curl -s http://localhost:5000/api/tours/bhutan-highlights | head -c 200
```
Expected: 4 editions; the single tour returns with `priceVal`/`desc` populated.

```bash
curl -s -X POST http://localhost:5000/api/tours \
  -H "Authorization: Bearer $ADMIN_API_KEY" -H "Content-Type: application/json" \
  -d '{"title":"Test Tour","duration":"1 Day","nights":0,"price":"$1","priceVal":1,"desc":"d","category":"Test","difficulty":"Easy","inclusions":[],"exclusions":[],"itinerary":[]}'
curl -s -X DELETE http://localhost:5000/api/tours/test-tour -H "Authorization: Bearer $ADMIN_API_KEY"
```
Expected: 201 create, then successful delete.

- [ ] **Step 4: Commit**

```bash
cd "D:/My Files/Help_Tourism_Bhutan"
git add backend/src/index.ts
git commit -m "feat(backend): migrate tours and tour editions routes to Firestore"
```

---

### Task 6: Hotels routes → Firestore

**Files:**
- Modify: `backend/src/index.ts`

**Interfaces:**
- Consumes: `db`, `firestoreConnected`, populated `hotels` collection (Task 3).

- [ ] **Step 1: Replace the hotels list route**

Find:
```ts
app.get('/api/hotels', async (req, res) => {
  const cacheKey = 'hotels:list';
  const cached = getCache(cacheKey, req);
  if (cached) return res.json(cached);

  if (dbConnected) {
    try {
      const data = await supabaseFetch('/hotels?select=*&order=id.asc');
      const formatted = data.map((h: any) => ({
        ...h,
        rating: parseFloat(h.rating) || h.rating
      }));
      setCache(cacheKey, formatted);
      return res.json(formatted);
    } catch (err: any) {
      console.error("Supabase fetch error for hotels:", err.message);
    }
  }
  res.json(memoryHotels);
});
```

Replace with:
```ts
app.get('/api/hotels', async (req, res) => {
  const cacheKey = 'hotels:list';
  const cached = getCache(cacheKey, req);
  if (cached) return res.json(cached);

  if (firestoreConnected && db) {
    try {
      const snapshot = await db.collection('hotels').orderBy('id').get();
      const formatted = snapshot.docs.map(doc => {
        const h: any = doc.data();
        return { ...h, rating: parseFloat(h.rating) || h.rating };
      });
      setCache(cacheKey, formatted);
      return res.json(formatted);
    } catch (err: any) {
      console.error("Firestore fetch error for hotels:", err.message);
    }
  }
  res.json(memoryHotels);
});
```

- [ ] **Step 2: Replace the create/update/delete hotel routes**

Find:
```ts
// CREATE Hotel
app.post('/api/hotels', authenticateAdmin, async (req, res) => {
  let { id, name, location, image, rating, price, description } = req.body;
  const payload = { id: id ? parseInt(id) : undefined, name, location, image, rating: parseFloat(rating) || 5.0, price, description };

  if (dbConnected) {
    try {
      if (!payload.id) {
        const existing = await supabaseFetch('/hotels?select=id&order=id.desc&limit=1');
        payload.id = existing && existing.length > 0 ? existing[0].id + 1 : 1;
      }
      await supabaseFetch('/hotels', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      clearCache('hotels');
      return res.status(201).json(payload);
    } catch (err: any) {
      console.error("Create hotel failed on Supabase:", err.message);
      return res.status(500).json({ error: `Database write failed: ${err.message}` });
    }
  }

  // Fallback to in-memory
  if (!payload.id) {
    payload.id = memoryHotels.length > 0 ? Math.max(...memoryHotels.map(h => h.id)) + 1 : 1;
  }
  memoryHotels.push(payload as any);
  clearCache('hotels');
  res.status(201).json(payload);
});

// UPDATE Hotel
app.put('/api/hotels/:id', authenticateAdmin, async (req, res) => {
  const id = parseInt(req.params.id as string);
  const { name, location, image, rating, price, description } = req.body;
  const payload = { name, location, image, rating: parseFloat(rating) || 5.0, price, description };

  if (dbConnected) {
    try {
      await supabaseFetch(`/hotels?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      clearCache('hotels');
      return res.json({ id, ...payload });
    } catch (err: any) {
      console.error(`Update hotel ${id} failed on Supabase:`, err.message);
      return res.status(500).json({ error: `Database write failed: ${err.message}` });
    }
  }

  // Fallback to in-memory
  const idx = memoryHotels.findIndex(h => h.id === id);
  if (idx !== -1) {
    memoryHotels[idx] = { id, ...payload } as any;
  }
  clearCache('hotels');
  res.json({ id, ...payload });
});

// DELETE Hotel
app.delete('/api/hotels/:id', authenticateAdmin, async (req, res) => {
  const id = parseInt(req.params.id as string);
  if (dbConnected) {
    try {
      await supabaseFetch(`/hotels?id=eq.${id}`, {
        method: 'DELETE'
      });
      clearCache('hotels');
      return res.json({ message: "Hotel deleted successfully", id });
    } catch (err: any) {
      console.error(`Delete hotel ${id} failed on Supabase:`, err.message);
      return res.status(500).json({ error: `Database write failed: ${err.message}` });
    }
  }

  // Fallback to in-memory
  memoryHotels = memoryHotels.filter(h => h.id !== id);
  clearCache('hotels');
  res.json({ message: "Hotel deleted successfully", id });
});
```

Replace with:
```ts
// CREATE Hotel
app.post('/api/hotels', authenticateAdmin, async (req, res) => {
  let { id, name, location, image, rating, price, description } = req.body;
  const payload: any = { id: id ? parseInt(id) : undefined, name, location, image, rating: parseFloat(rating) || 5.0, price, description };

  if (firestoreConnected && db) {
    try {
      if (!payload.id) {
        const existingSnap = await db.collection('hotels').orderBy('id', 'desc').limit(1).get();
        payload.id = existingSnap.empty ? 1 : existingSnap.docs[0].data().id + 1;
      }
      await db.collection('hotels').doc(String(payload.id)).set(payload);
      clearCache('hotels');
      return res.status(201).json(payload);
    } catch (err: any) {
      console.error("Create hotel failed on Firestore:", err.message);
      return res.status(500).json({ error: `Database write failed: ${err.message}` });
    }
  }

  // Fallback to in-memory
  if (!payload.id) {
    payload.id = memoryHotels.length > 0 ? Math.max(...memoryHotels.map(h => h.id)) + 1 : 1;
  }
  memoryHotels.push(payload as any);
  clearCache('hotels');
  res.status(201).json(payload);
});

// UPDATE Hotel
app.put('/api/hotels/:id', authenticateAdmin, async (req, res) => {
  const id = parseInt(req.params.id as string);
  const { name, location, image, rating, price, description } = req.body;
  const payload: any = { id, name, location, image, rating: parseFloat(rating) || 5.0, price, description };

  if (firestoreConnected && db) {
    try {
      await db.collection('hotels').doc(String(id)).set(payload, { merge: true });
      clearCache('hotels');
      return res.json(payload);
    } catch (err: any) {
      console.error(`Update hotel ${id} failed on Firestore:`, err.message);
      return res.status(500).json({ error: `Database write failed: ${err.message}` });
    }
  }

  // Fallback to in-memory
  const idx = memoryHotels.findIndex(h => h.id === id);
  if (idx !== -1) {
    memoryHotels[idx] = payload as any;
  }
  clearCache('hotels');
  res.json(payload);
});

// DELETE Hotel
app.delete('/api/hotels/:id', authenticateAdmin, async (req, res) => {
  const id = parseInt(req.params.id as string);
  if (firestoreConnected && db) {
    try {
      await db.collection('hotels').doc(String(id)).delete();
      clearCache('hotels');
      return res.json({ message: "Hotel deleted successfully", id });
    } catch (err: any) {
      console.error(`Delete hotel ${id} failed on Firestore:`, err.message);
      return res.status(500).json({ error: `Database write failed: ${err.message}` });
    }
  }

  // Fallback to in-memory
  memoryHotels = memoryHotels.filter(h => h.id !== id);
  clearCache('hotels');
  res.json({ message: "Hotel deleted successfully", id });
});
```

- [ ] **Step 3: Verify**

```bash
curl -s http://localhost:5000/api/hotels | head -c 300
curl -s -X POST http://localhost:5000/api/hotels \
  -H "Authorization: Bearer $ADMIN_API_KEY" -H "Content-Type: application/json" \
  -d '{"name":"Test Hotel","location":"Test","image":"/x.jpg","rating":4.5,"price":"$1","description":"d"}'
```
Expected: 4 hotels listed; POST returns 201 with `id: 5`. Clean up with `curl -X DELETE http://localhost:5000/api/hotels/5 -H "Authorization: Bearer $ADMIN_API_KEY"`.

- [ ] **Step 4: Commit**

```bash
cd "D:/My Files/Help_Tourism_Bhutan"
git add backend/src/index.ts
git commit -m "feat(backend): migrate hotels routes to Firestore"
```

---

### Task 7: Settings routes (about/contact/testimonials) → Firestore

**Files:**
- Modify: `backend/src/index.ts`

**Interfaces:**
- Consumes: `db`, `firestoreConnected`, populated `settings` collection (Task 3).

- [ ] **Step 1: Replace the about routes**

Find:
```ts
app.get('/api/about', async (req, res) => {
  const cacheKey = 'about:data';
  const cached = getCache(cacheKey, req);
  if (cached) return res.json(cached);

  if (dbConnected) {
    try {
      const data = await supabaseFetch('/settings?key=eq.about&select=value');
      if (data && data.length > 0) {
        const value = data[0].value;
        setCache(cacheKey, value);
        return res.json(value);
      }
    } catch (err: any) {
      console.error("Supabase fetch error for about, falling back to local file:", err.message);
    }
  }
```

Replace with:
```ts
app.get('/api/about', async (req, res) => {
  const cacheKey = 'about:data';
  const cached = getCache(cacheKey, req);
  if (cached) return res.json(cached);

  if (firestoreConnected && db) {
    try {
      const doc = await db.collection('settings').doc('about').get();
      if (doc.exists) {
        const value = doc.data()!.value;
        setCache(cacheKey, value);
        return res.json(value);
      }
    } catch (err: any) {
      console.error("Firestore fetch error for about, falling back to local file:", err.message);
    }
  }
```

(The rest of the function — the local-file/memory fallback — is unchanged; only the `if (dbConnected) { ... }` block's body changes.)

Find:
```ts
app.put('/api/about', authenticateAdmin, async (req, res) => {
  if (dbConnected) {
    try {
      await supabaseFetch('/settings', {
        method: 'POST',
        headers: { 'Prefer': 'resolution=merge-duplicates' },
        body: JSON.stringify({ key: 'about', value: req.body })
      });
      clearCache('about:');
      return res.json(req.body);
    } catch (err: any) {
      console.error("Supabase save error for about:", err.message);
      return res.status(500).json({ error: `Database write failed: ${err.message}` });
    }
  }
```

Replace with:
```ts
app.put('/api/about', authenticateAdmin, async (req, res) => {
  if (firestoreConnected && db) {
    try {
      await db.collection('settings').doc('about').set({ key: 'about', value: req.body });
      clearCache('about:');
      return res.json(req.body);
    } catch (err: any) {
      console.error("Firestore save error for about:", err.message);
      return res.status(500).json({ error: `Database write failed: ${err.message}` });
    }
  }
```

- [ ] **Step 2: Replace the contact routes**

Find:
```ts
app.get('/api/contact', async (req, res) => {
  const cacheKey = 'contact:data';
  const cached = getCache(cacheKey, req);
  if (cached) return res.json(cached);

  if (dbConnected) {
    try {
      const data = await supabaseFetch('/settings?key=eq.contact&select=value');
      if (data && data.length > 0) {
        const value = data[0].value;
        setCache(cacheKey, value);
        return res.json(value);
      }
    } catch (err: any) {
      console.error("Supabase fetch error for contact, falling back to local file:", err.message);
    }
  }
```

Replace with:
```ts
app.get('/api/contact', async (req, res) => {
  const cacheKey = 'contact:data';
  const cached = getCache(cacheKey, req);
  if (cached) return res.json(cached);

  if (firestoreConnected && db) {
    try {
      const doc = await db.collection('settings').doc('contact').get();
      if (doc.exists) {
        const value = doc.data()!.value;
        setCache(cacheKey, value);
        return res.json(value);
      }
    } catch (err: any) {
      console.error("Firestore fetch error for contact, falling back to local file:", err.message);
    }
  }
```

Find:
```ts
app.put('/api/contact', authenticateAdmin, async (req, res) => {
  if (dbConnected) {
    try {
      await supabaseFetch('/settings', {
        method: 'POST',
        headers: { 'Prefer': 'resolution=merge-duplicates' },
        body: JSON.stringify({ key: 'contact', value: req.body })
      });
      clearCache('contact:');
      return res.json(req.body);
    } catch (err: any) {
      console.error("Supabase save error for contact:", err.message);
      return res.status(500).json({ error: `Database write failed: ${err.message}` });
    }
  }
```

Replace with:
```ts
app.put('/api/contact', authenticateAdmin, async (req, res) => {
  if (firestoreConnected && db) {
    try {
      await db.collection('settings').doc('contact').set({ key: 'contact', value: req.body });
      clearCache('contact:');
      return res.json(req.body);
    } catch (err: any) {
      console.error("Firestore save error for contact:", err.message);
      return res.status(500).json({ error: `Database write failed: ${err.message}` });
    }
  }
```

- [ ] **Step 3: Replace the testimonials routes**

Find:
```ts
app.get('/api/testimonials', async (req, res) => {
  const cacheKey = 'testimonials:list';
  const cached = getCache(cacheKey, req);
  if (cached) return res.json(cached);

  if (dbConnected) {
    try {
      const data = await supabaseFetch('/settings?key=eq.testimonials&select=value');
      if (data && data.length > 0) {
        const value = data[0].value;
        setCache(cacheKey, value);
        return res.json(value);
      }
    } catch (err: any) {
      console.error("Supabase fetch error for testimonials, falling back to local file:", err.message);
    }
  }
```

Replace with:
```ts
app.get('/api/testimonials', async (req, res) => {
  const cacheKey = 'testimonials:list';
  const cached = getCache(cacheKey, req);
  if (cached) return res.json(cached);

  if (firestoreConnected && db) {
    try {
      const doc = await db.collection('settings').doc('testimonials').get();
      if (doc.exists) {
        const value = doc.data()!.value;
        setCache(cacheKey, value);
        return res.json(value);
      }
    } catch (err: any) {
      console.error("Firestore fetch error for testimonials, falling back to local file:", err.message);
    }
  }
```

Find:
```ts
app.put('/api/testimonials', authenticateAdmin, async (req, res) => {
  if (dbConnected) {
    try {
      await supabaseFetch('/settings', {
        method: 'POST',
        headers: { 'Prefer': 'resolution=merge-duplicates' },
        body: JSON.stringify({ key: 'testimonials', value: req.body })
      });
      clearCache('testimonials:');
      return res.json(req.body);
    } catch (err: any) {
      console.error("Supabase save error for testimonials:", err.message);
      return res.status(500).json({ error: `Database write failed: ${err.message}` });
    }
  }
```

Replace with:
```ts
app.put('/api/testimonials', authenticateAdmin, async (req, res) => {
  if (firestoreConnected && db) {
    try {
      await db.collection('settings').doc('testimonials').set({ key: 'testimonials', value: req.body });
      clearCache('testimonials:');
      return res.json(req.body);
    } catch (err: any) {
      console.error("Firestore save error for testimonials:", err.message);
      return res.status(500).json({ error: `Database write failed: ${err.message}` });
    }
  }
```

- [ ] **Step 4: Verify**

```bash
curl -s http://localhost:5000/api/about | head -c 150
curl -s http://localhost:5000/api/contact | head -c 150
curl -s http://localhost:5000/api/testimonials | head -c 150
```
Expected: real seeded content for each (about's `stat1Val: "2010"`, contact's `baseTitle: "The Base"`, testimonials array starting with Dr. Tashi Wangchuk), not the hardcoded `defaultAboutData`/`defaultContactData`/`defaultTestimonials` fallback values.

```bash
curl -s -X PUT http://localhost:5000/api/about -H "Authorization: Bearer $ADMIN_API_KEY" -H "Content-Type: application/json" -d '{"test":"value"}'
curl -s http://localhost:5000/api/about
curl -s -X PUT http://localhost:5000/api/about -H "Authorization: Bearer $ADMIN_API_KEY" -H "Content-Type: application/json" -d @- <<'EOF'
{"philosophyText":"restored","stat1Label":"Founded","stat1Val":"2010","stat2Label":"Guides","stat2Val":"50+ Local","stat3Label":"Regions","stat3Val":"All 20 Dzongkhags","stat4Label":"Happiness","stat4Val":"100% GNH","pillar1Title":"x","pillar1Desc":"x","pillar2Title":"x","pillar2Desc":"x","pillar3Title":"x","pillar3Desc":"x","pillar4Title":"x","pillar4Desc":"x"}
EOF
```
Expected: the PUT persists and GET reflects it immediately (restore real content with the second PUT afterward, since this is a shared doc).

- [ ] **Step 5: Commit**

```bash
cd "D:/My Files/Help_Tourism_Bhutan"
git add backend/src/index.ts
git commit -m "feat(backend): migrate about/contact/testimonials settings routes to Firestore"
```

---

### Task 8: Tourists routes → Firestore

**Files:**
- Modify: `backend/src/index.ts`

**Interfaces:**
- Consumes: `db`, `firestoreConnected`, `tourists` collection (Task 3, empty today).

- [ ] **Step 1: Replace the tourists list route**

Find:
```ts
app.get('/api/tourists', async (req, res) => {
  const cacheKey = 'tourists:list';
  const cached = getCache(cacheKey, req);
  if (cached) return res.json(cached);

  if (dbConnected) {
    try {
      const data = await supabaseFetch('/tourists?select=*&order=id.asc');
      const formatted = data.map((t: any) => ({
        id: t.id,
        name: t.name,
        nationality: t.nationality,
        passportNumber: t.passport_number || t.passportNumber,
        email: t.email,
        phone: t.phone,
        tourName: t.tour_name || t.tourName,
        checkInDate: t.check_in_date || t.checkInDate,
        checkOutDate: t.check_out_date || t.checkOutDate,
        sdfStatus: t.sdf_status || t.sdfStatus,
        specialRequests: t.special_requests || t.specialRequests
      }));
      setCache(cacheKey, formatted);
      return res.json(formatted);
    } catch (err: any) {
      console.error("Supabase fetch error for tourists, falling back to local file:", err.message);
    }
  }
```

Replace with:
```ts
app.get('/api/tourists', async (req, res) => {
  const cacheKey = 'tourists:list';
  const cached = getCache(cacheKey, req);
  if (cached) return res.json(cached);

  if (firestoreConnected && db) {
    try {
      const snapshot = await db.collection('tourists').orderBy('id').get();
      const formatted = snapshot.docs.map(doc => {
        const t: any = doc.data();
        return {
          id: t.id,
          name: t.name,
          nationality: t.nationality,
          passportNumber: t.passport_number,
          email: t.email,
          phone: t.phone,
          tourName: t.tour_name,
          checkInDate: t.check_in_date,
          checkOutDate: t.check_out_date,
          sdfStatus: t.sdf_status,
          specialRequests: t.special_requests
        };
      });
      setCache(cacheKey, formatted);
      return res.json(formatted);
    } catch (err: any) {
      console.error("Firestore fetch error for tourists, falling back to local file:", err.message);
    }
  }
```

(The local-file/memory fallback body below is unchanged.)

- [ ] **Step 2: Replace the create/update/delete tourist routes**

Find:
```ts
app.post('/api/tourists', authenticateAdmin, async (req, res) => {
  const body = req.body;
  const dbPayload = {
    name: body.name,
    nationality: body.nationality,
    passport_number: body.passportNumber,
    email: body.email,
    phone: body.phone,
    tour_name: body.tourName,
    check_in_date: body.checkInDate,
    check_out_date: body.checkOutDate,
    sdf_status: body.sdfStatus,
    special_requests: body.specialRequests
  };

  if (dbConnected) {
    try {
      const inserted = await supabaseFetch('/tourists', {
        method: 'POST',
        headers: { 'Prefer': 'return=representation' },
        body: JSON.stringify(dbPayload)
      });
      clearCache('tourists:');
      if (inserted && inserted.length > 0) {
        const t = inserted[0];
        return res.json({
          id: t.id,
          name: t.name,
          nationality: t.nationality,
          passportNumber: t.passport_number || t.passportNumber,
          email: t.email,
          phone: t.phone,
          tourName: t.tour_name || t.tourName,
          checkInDate: t.check_in_date || t.checkInDate,
          checkOutDate: t.check_out_date || t.checkOutDate,
          sdfStatus: t.sdf_status || t.sdfStatus,
          specialRequests: t.special_requests || t.specialRequests
        });
      }
    } catch (err: any) {
      console.error("Supabase insert error for tourists:", err.message);
      return res.status(500).json({ error: `Database write failed: ${err.message}` });
    }
  }
```

Replace with:
```ts
app.post('/api/tourists', authenticateAdmin, async (req, res) => {
  const body = req.body;
  const dbPayload = {
    name: body.name,
    nationality: body.nationality,
    passport_number: body.passportNumber,
    email: body.email,
    phone: body.phone,
    tour_name: body.tourName,
    check_in_date: body.checkInDate,
    check_out_date: body.checkOutDate,
    sdf_status: body.sdfStatus,
    special_requests: body.specialRequests
  };

  if (firestoreConnected && db) {
    try {
      const existingSnap = await db.collection('tourists').orderBy('id', 'desc').limit(1).get();
      const newId = existingSnap.empty ? 1 : existingSnap.docs[0].data().id + 1;
      const t = { id: newId, ...dbPayload };
      await db.collection('tourists').doc(String(newId)).set(t);
      clearCache('tourists:');
      return res.json({
        id: t.id,
        name: t.name,
        nationality: t.nationality,
        passportNumber: t.passport_number,
        email: t.email,
        phone: t.phone,
        tourName: t.tour_name,
        checkInDate: t.check_in_date,
        checkOutDate: t.check_out_date,
        sdfStatus: t.sdf_status,
        specialRequests: t.special_requests
      });
    } catch (err: any) {
      console.error("Firestore insert error for tourists:", err.message);
      return res.status(500).json({ error: `Database write failed: ${err.message}` });
    }
  }
```

(Note: this is the Review Focus item — `existingSnap.empty` must be handled, since the collection has zero documents today; `newId` correctly becomes `1` in that case.)

Find:
```ts
app.put('/api/tourists/:id', authenticateAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const body = req.body;
  const dbPayload = {
    name: body.name,
    nationality: body.nationality,
    passport_number: body.passportNumber,
    email: body.email,
    phone: body.phone,
    tour_name: body.tourName,
    check_in_date: body.checkInDate,
    check_out_date: body.checkOutDate,
    sdf_status: body.sdfStatus,
    special_requests: body.specialRequests
  };

  if (dbConnected) {
    try {
      const updated = await supabaseFetch(`/tourists?id=eq.${id}`, {
        method: 'PATCH',
        headers: { 'Prefer': 'return=representation' },
        body: JSON.stringify(dbPayload)
      });
      clearCache('tourists:');
      if (updated && updated.length > 0) {
        const t = updated[0];
        return res.json({
          id: t.id,
          name: t.name,
          nationality: t.nationality,
          passportNumber: t.passport_number || t.passportNumber,
          email: t.email,
          phone: t.phone,
          tourName: t.tour_name || t.tourName,
          checkInDate: t.check_in_date || t.checkInDate,
          checkOutDate: t.check_out_date || t.checkOutDate,
          sdfStatus: t.sdf_status || t.sdfStatus,
          specialRequests: t.special_requests || t.specialRequests
        });
      }
    } catch (err: any) {
      console.error("Supabase update error for tourists:", err.message);
      return res.status(500).json({ error: `Database write failed: ${err.message}` });
    }
  }
```

Replace with:
```ts
app.put('/api/tourists/:id', authenticateAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const body = req.body;
  const dbPayload = {
    name: body.name,
    nationality: body.nationality,
    passport_number: body.passportNumber,
    email: body.email,
    phone: body.phone,
    tour_name: body.tourName,
    check_in_date: body.checkInDate,
    check_out_date: body.checkOutDate,
    sdf_status: body.sdfStatus,
    special_requests: body.specialRequests
  };

  if (firestoreConnected && db) {
    try {
      const t = { id, ...dbPayload };
      await db.collection('tourists').doc(String(id)).set(t, { merge: true });
      clearCache('tourists:');
      return res.json({
        id: t.id,
        name: t.name,
        nationality: t.nationality,
        passportNumber: t.passport_number,
        email: t.email,
        phone: t.phone,
        tourName: t.tour_name,
        checkInDate: t.check_in_date,
        checkOutDate: t.check_out_date,
        sdfStatus: t.sdf_status,
        specialRequests: t.special_requests
      });
    } catch (err: any) {
      console.error("Firestore update error for tourists:", err.message);
      return res.status(500).json({ error: `Database write failed: ${err.message}` });
    }
  }
```

Find:
```ts
app.delete('/api/tourists/:id', authenticateAdmin, async (req, res) => {
  const id = Number(req.params.id);

  if (dbConnected) {
    try {
      await supabaseFetch(`/tourists?id=eq.${id}`, {
        method: 'DELETE'
      });
      clearCache('tourists:');
    } catch (err: any) {
      console.error("Supabase delete error for tourists:", err.message);
      return res.status(500).json({ error: `Database write failed: ${err.message}` });
    }
  }
```

Replace with:
```ts
app.delete('/api/tourists/:id', authenticateAdmin, async (req, res) => {
  const id = Number(req.params.id);

  if (firestoreConnected && db) {
    try {
      await db.collection('tourists').doc(String(id)).delete();
      clearCache('tourists:');
    } catch (err: any) {
      console.error("Firestore delete error for tourists:", err.message);
      return res.status(500).json({ error: `Database write failed: ${err.message}` });
    }
  }
```

- [ ] **Step 3: Verify, specifically the empty-collection create path**

```bash
curl -s http://localhost:5000/api/tourists
```
Expected: `[]` (empty array, collection has zero docs).

```bash
curl -s -X POST http://localhost:5000/api/tourists \
  -H "Authorization: Bearer $ADMIN_API_KEY" -H "Content-Type: application/json" \
  -d '{"name":"Test Tourist","nationality":"Test","passportNumber":"X1","email":"t@example.com","phone":"123","tourName":"bhutan-highlights","checkInDate":"2026-01-01","checkOutDate":"2026-01-05","sdfStatus":"Paid"}'
```
Expected: 200 with `id: 1` (confirms the empty-collection auto-increment doesn't crash — this is the Review Focus item). Then:
```bash
curl -s -X PUT http://localhost:5000/api/tourists/1 -H "Authorization: Bearer $ADMIN_API_KEY" -H "Content-Type: application/json" -d '{"name":"Updated","nationality":"Test","passportNumber":"X1","email":"t@example.com","phone":"123","tourName":"bhutan-highlights","checkInDate":"2026-01-01","checkOutDate":"2026-01-05","sdfStatus":"Paid"}'
curl -s -X DELETE http://localhost:5000/api/tourists/1 -H "Authorization: Bearer $ADMIN_API_KEY"
curl -s http://localhost:5000/api/tourists
```
Expected: update reflects `"name":"Updated"`, delete succeeds, final list is `[]` again.

- [ ] **Step 4: Commit**

```bash
cd "D:/My Files/Help_Tourism_Bhutan"
git add backend/src/index.ts
git commit -m "feat(backend): migrate tourists routes to Firestore"
```

---

### Task 9: File upload → Cloudinary

**Files:**
- Modify: `backend/src/index.ts`

**Interfaces:**
- Consumes: `cloudinary`, `isCloudinaryConfigured` from `./cloudinary` (Task 1).

- [ ] **Step 1: Replace the Supabase Storage upload helper**

In `backend/src/index.ts`, add the import near the top (alongside the `./firebase` import added in Task 2):
```ts
import { cloudinary, isCloudinaryConfigured } from './cloudinary';
```

Find:
```ts
// Helper to upload files to Supabase Storage
async function uploadToSupabaseStorage(filename: string, buffer: Buffer, mimeType: string): Promise<string> {
  const url = `${SUPABASE_URL}/storage/v1/object/cms-media/${filename}`;
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': mimeType
  };
  if (SUPABASE_KEY) {
    headers['apikey'] = SUPABASE_KEY;
  }
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: buffer
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase Storage upload failed: ${response.status} ${response.statusText} - ${errorText}`);
  }
  return `${SUPABASE_URL}/storage/v1/object/public/cms-media/${filename}`;
}
```

Replace with:
```ts
// Helper to upload files to Cloudinary
async function uploadToCloudinary(filename: string, buffer: Buffer, mimeType: string): Promise<string> {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured (missing CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET)');
  }
  const publicId = filename.replace(/\.[^.]+$/, ''); // Cloudinary appends its own extension
  const dataUri = `data:${mimeType};base64,${buffer.toString('base64')}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    public_id: publicId,
    folder: 'cms-media',
    overwrite: true,
  });
  return result.secure_url;
}
```

- [ ] **Step 2: Update the upload route to use it**

Find:
```ts
    // Try uploading to Supabase Storage first (for production)
    if (dbConnected && SUPABASE_URL && SUPABASE_KEY) {
      try {
        const mimeMatch = data.match(/^data:(image\/\w+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        
        const publicUrl = await uploadToSupabaseStorage(filename, buffer, mimeType);
        console.log("Successfully uploaded file to Supabase Storage cms-media:", filename);
        return res.json({ url: publicUrl });
      } catch (err: any) {
        console.warn("Supabase Storage upload failed, falling back to local file:", err.message);
        if (process.env.NODE_ENV === 'production' || process.env.VERCEL || process.env.VERCEL_ENV) {
          return res.status(500).json({ error: `Supabase Storage upload failed: ${err.message}` });
        }
      }
    }
```

Replace with:
```ts
    // Try uploading to Cloudinary first (for production)
    if (isCloudinaryConfigured()) {
      try {
        const mimeMatch = data.match(/^data:(image\/\w+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

        const publicUrl = await uploadToCloudinary(filename, buffer, mimeType);
        console.log("Successfully uploaded file to Cloudinary cms-media:", filename);
        return res.json({ url: publicUrl });
      } catch (err: any) {
        console.warn("Cloudinary upload failed, falling back to local file:", err.message);
        if (process.env.NODE_ENV === 'production' || process.env.VERCEL || process.env.VERCEL_ENV) {
          return res.status(500).json({ error: `Cloudinary upload failed: ${err.message}` });
        }
      }
    }
```

(Everything above this block — extension allowlist, base64 extraction, 5MB size check, filename sanitization — and everything below it — the local `public/uploads/` fallback — is untouched, preserving the Review Focus item: upload validation survives the backend swap.)

- [ ] **Step 3: Verify**

```bash
cd backend && npm run dev
```
```bash
python3 -c "
import base64, json
with open('../public/paro-taksang.jpg','rb') as f:
    b64 = base64.b64encode(f.read()).decode()
print(json.dumps({'name':'test.jpg','data':f'data:image/jpeg;base64,{b64}'}))
" > /tmp/upload-payload.json
curl -s -X POST http://localhost:5000/api/upload -H "Authorization: Bearer $ADMIN_API_KEY" -H "Content-Type: application/json" -d @/tmp/upload-payload.json
```
Expected: `{"url":"https://res.cloudinary.com/<cloud-name>/image/upload/.../cms-media/<timestamp>-test.jpg"}`. Open that URL in a browser — the image loads.

Verify validation still rejects bad input:
```bash
curl -s -X POST http://localhost:5000/api/upload -H "Authorization: Bearer $ADMIN_API_KEY" -H "Content-Type: application/json" -d '{"name":"malware.exe","data":"data:image/jpeg;base64,abc"}'
```
Expected: `{"error":"Invalid file extension. Only images are allowed."}`.

- [ ] **Step 4: Commit**

```bash
cd "D:/My Files/Help_Tourism_Bhutan"
git add backend/src/index.ts
git commit -m "feat(backend): migrate file upload endpoint to Cloudinary"
```

---

### Task 10: Cleanup — remove Supabase code/deps and fix secret exposure

**Files:**
- Modify: `backend/src/index.ts`
- Modify: `backend/package.json`
- Delete: `backend/src/db.ts`, `backend/src/seed.ts`, `backend/schema.sql`, `backend/scripts/migrate-to-firebase.ts`
- Modify: `backend/.env`
- Modify: `.gitignore` (repo root)
- Modify: git index (untrack `.env.development`)

**Interfaces:**
- None — this task only removes now-dead code and fixes a pre-existing secret-exposure issue. No other task depends on anything removed here (confirmed: every route was migrated off `dbConnected`/`supabaseFetch`/`uploadToSupabaseStorage` in Tasks 4-9).

- [ ] **Step 1: Remove the Supabase helper, env vars, and old health check from index.ts**

Find:
```ts
// Securely check for required database parameters
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn("WARNING: SUPABASE_URL and SUPABASE_KEY environment variables are not defined. Operating in local memory fallback mode.");
}

if (!ADMIN_API_KEY) {
```

Replace with:
```ts
// Securely check for required parameters
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

if (!ADMIN_API_KEY) {
```

Find and delete entirely (the `supabaseFetch` helper, no longer called anywhere):
```ts
// Helper to fetch from Supabase REST API
async function supabaseFetch(path: string, options: any = {}): Promise<any> {
  const url = `${SUPABASE_URL}/rest/v1${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Supabase request failed: ${response.status} ${response.statusText} - ${errorText}`);
  }
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return null;
}

```

Find and delete entirely (the old Supabase health check, superseded by `checkFirestore` from Task 2):
```ts
// Helper to check DB health
let dbConnected = false;
const checkDb = async () => {
  try {
    await supabaseFetch('/destinations?select=id&limit=1');
    dbConnected = true;
    console.log("Supabase REST API database connected and verified successfully!");
  } catch (err: any) {
    dbConnected = false;
    console.warn("Supabase REST API connection failed. Server is operating in Mock-Fallback mode. Error:", err.message);
  }
};
checkDb();

```

(Leave the `checkFirestore();` call, which now runs alone.)

- [ ] **Step 2: Remove `pg` from backend dependencies**

Edit `backend/package.json`, remove the `pg` line from `dependencies` and `@types/pg` from `devDependencies`:

```json
"dependencies": {
  "cors": "^2.8.5",
  "dotenv": "^16.4.7",
  "express": "^4.21.2",
  "firebase-admin": "^13.0.0",
  "cloudinary": "^2.5.0"
},
"devDependencies": {
  "@types/cors": "^2.8.17",
  "@types/express": "^5.0.0",
  "@types/node": "^22.10.1",
  "ts-node-dev": "^2.0.0",
  "typescript": "^5.7.2"
}
```

Run: `cd backend && npm install`

- [ ] **Step 3: Delete dead files**

```bash
cd "D:/My Files/Help_Tourism_Bhutan"
rm backend/src/db.ts backend/src/seed.ts backend/schema.sql backend/scripts/migrate-to-firebase.ts
```

- [ ] **Step 4: Remove Supabase/Postgres env vars**

Edit `backend/.env`, remove the `SUPABASE_URL`, `SUPABASE_KEY`, and `DATABASE_URL` lines (keep `FIREBASE_SERVICE_ACCOUNT`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `PORT`, `ADMIN_API_KEY`).

- [ ] **Step 5: Fix the committed-secret issue**

Check current `.gitignore` at the repo root — it's missing `.env.development`/`.env.production` patterns. Add:

```
databasedoc/
.env.development
.env.production
```

Untrack the file that leaked a live Supabase key into git history:
```bash
cd "D:/My Files/Help_Tourism_Bhutan"
git rm --cached .env.development
```

- [ ] **Step 6: Verify the server still builds and runs clean**

```bash
cd backend && npx tsc --noEmit
```
Expected: no TypeScript errors (confirms no dangling references to `supabaseFetch`, `dbConnected`, `SUPABASE_URL`, `SUPABASE_KEY`, or `uploadToSupabaseStorage` remain).

```bash
npm run dev
```
Expected: starts cleanly, logs only `Firestore connected and verified successfully!` (no more Supabase warning line, since that code path no longer exists).

- [ ] **Step 7: Commit**

```bash
cd "D:/My Files/Help_Tourism_Bhutan"
git add -A
git commit -m "chore(backend): remove dead Supabase code/deps, untrack leaked env file"
```

---

### Task 11: End-to-end verification

**Files:** none (verification only)

**Interfaces:** none.

- [ ] **Step 1: Full backend route smoke test**

With `npm run dev` running in `backend/`, run through every route once more end-to-end (building on the per-task checks already done): `GET /api/destinations`, `GET /api/destinations/:id` for all 6 ids, `GET /api/tours`, `GET /api/tours/editions`, `GET /api/tours/:id` for a few ids, `GET /api/hotels`, `GET /api/about`, `GET /api/contact`, `GET /api/testimonials`, `GET /api/tourists`, `GET /api/verify` (with and without a valid bearer token).

Expected: every GET returns 200 with real migrated data (not mock fallback data); `/api/verify` returns 401 without a token and `{"success":true,...}` with a valid one.

- [ ] **Step 2: Frontend click-through**

```bash
cd "D:/My Files/Help_Tourism_Bhutan" && npm run dev
```
With the backend also running, open the site in a browser and check:
- Homepage loads destinations and tours.
- A destination detail page shows its attractions.
- A tour detail page shows inclusions/exclusions/itinerary correctly rendered (not `[object Object]` or raw JSON text — confirms Review Focus item 3 end-to-end through the UI, not just the API).
- The images that were rewritten (Bumthang Valley destination, and the 4 hotels) load correctly as static assets from `public/cms-media/`.
- Log into `/admin`, open each tab (Destinations, Tours, Hotels, About, Contact, Testimonials, Tourists), and perform one edit + save in each, confirming it persists after a page refresh.
- Upload a new image via the admin media upload control and confirm it appears and loads.

- [ ] **Step 3: Confirm no remaining Supabase references**

```bash
cd "D:/My Files/Help_Tourism_Bhutan"
grep -ril supabase --include="*.ts" --include="*.tsx" --include="*.json" backend src 2>/dev/null
```
Expected: no output (empty) — confirms zero remaining source-code references to Supabase anywhere in the backend or frontend.

- [ ] **Step 4: Final commit (if any fixes were needed during verification)**

```bash
cd "D:/My Files/Help_Tourism_Bhutan"
git add -A
git commit -m "fix: address issues found during end-to-end migration verification"
```

(Skip this step if verification found no issues.)
