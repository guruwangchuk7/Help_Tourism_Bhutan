# Supabase → Firebase Migration

## Context

The project's Supabase free-tier project (`helptoursimBhutan`, ref `sahdrcajbflinfhlwgmb`) is paused and unresumable without upgrading to Pro or freeing a project slot in the account (2-free-project org limit). Since the goal is to leave Supabase permanently, we migrate instead of resuming.

**Data recovered (verified against the downloaded backup, not assumed):**
- Database backup: `databasedoc/db_cluster.sql` (plain-SQL `pg_dump`, Postgres 17.6.1.127), decompressed from `db_cluster-27-07-2026@11-40-28.backup.gz`.
- Storage backup: `databasedoc/sahdrcajbflinfhlwgmb/cms-media/` — 20 files, already extracted.

**Full Supabase footprint audit** (confirmed by grepping the dump, not inferred):
- 7 application tables in `public` schema: `destinations` (6 rows), `attractions` (3), `tours` (13), `tour_editions` (4), `hotels` (4), `settings` (3), `tourists` (0 — no real bookings exist, nothing lost).
- 5 Storage buckets existed (`cms-media`, `tour-assets`, `destination-assets`, `user-profiles`, `documents`); only `cms-media` has objects (20, all recovered). The other 4 are empty and irrelevant to migration.
- No custom Postgres functions, no triggers, and no RLS policies on any `public.*` table. All triggers/policies in the dump are Supabase-internal plumbing on its own `storage`/`realtime`/`auth` schemas (e.g. public-read policies on buckets) — not app logic.
- `auth.users` has exactly 1 row (the dashboard owner account) — confirms Supabase Auth is not used by the app.
- Extensions present (`pgcrypto`, `uuid-ossp`, `pg_stat_statements`, `supabase_vault`) are Supabase defaults, unused by app code.
- The only code in the repo that talks to Supabase is `backend/src/index.ts`, via raw `fetch()` against Supabase's PostgREST and Storage REST APIs (no `supabase-js` SDK). The frontend never talks to Supabase directly — only to this Express backend.

This means the migration surface is fully bounded: 7 tables + 1 bucket with 20 files, one backend file to rewrite, zero frontend changes.

## Target Architecture

- **Firestore** replaces Postgres/PostgREST for the 7 tables, modeled as flat top-level collections (not subcollections, not denormalized) — closest to current shape, least rewrite:
  - `destinations/{id}`, `attractions/{id}` (field `destinationId` holds the old FK), `tours/{id}`, `tourEditions/{id}` (field `tourId` holds the old FK), `hotels/{id}`, `tourists/{id}` — same data, Firestore-native types (arrays/maps instead of JSONB).
  - `settings/{key}` — one doc per key (`about`, `contact`, `testimonials`), with the existing JSON value stored under a `value` field.
- **Firebase Storage** replaces Supabase Storage for the `cms-media` bucket. Files keep their existing names/paths under a `cms-media/` prefix in the default bucket.
- **Backend** (`backend/src/index.ts`) gets a Firestore/Storage data-access layer via `firebase-admin`, replacing `supabaseFetch()` / `uploadToSupabaseStorage()`. Route paths, request/response shapes, and the `ADMIN_API_KEY` auth middleware are unchanged, so the frontend (including `AdminDashboard.tsx`) requires no changes.
- **Credentials**: a Firebase service-account JSON (generated from the new Firebase project you create and hand to the client) stored as an env var (`FIREBASE_SERVICE_ACCOUNT`, JSON string) plus `FIREBASE_STORAGE_BUCKET`. Matches how `DATABASE_URL` is handled today — one secret env var, no cloud-specific IAM setup, works unchanged on Vercel.

## Data Model Mapping

| Supabase table (Postgres types) | Firestore collection | Notes |
|---|---|---|
| `destinations(id int, name, image, description, price, rating numeric, location, altitude, ideal_stay, peak_period, language)` | `destinations/{id}` | `id` (string of the int) becomes the doc ID. `rating` stored as a Firestore number. |
| `attractions(id int, destination_id int, name, description, image)` | `attractions/{id}` | `destination_id` → `destinationId` field, plain reference (string), app does the join client/server-side as it effectively already does. |
| `tours(id varchar PK, title, duration, nights int, price, price_val int, image, description, category, difficulty, inclusions jsonb, exclusions jsonb, itinerary jsonb)` | `tours/{id}` | `id` is already a slug string (e.g. `bhutan-highlights`) — used directly as the Firestore doc ID. `inclusions`/`exclusions` → Firestore array of strings. `itinerary` → Firestore array of maps. |
| `tour_editions(id int, tour_id varchar, title, period, price, image, icon)` | `tourEditions/{id}` | `tour_id` → `tourId` field. |
| `hotels(id int, name, location, image, rating numeric, price, description)` | `hotels/{id}` | Direct mapping. |
| `settings(key varchar PK, value jsonb)` | `settings/{key}` | Doc fields: `{ value: <existing jsonb> }`. |
| `tourists(id int, name, nationality, passport_number, email, phone, tour_name, check_in_date date, check_out_date date, sdf_status, special_requests)` | `tourists/{id}` | Table is empty — collection created but no migration data needed. `check_in_date`/`check_out_date` stored as Firestore Timestamps going forward. |

**Image URL rewriting**: 6 rows (in `destinations` and `hotels`) have `image` values pointing to `https://sahdrcajbflinfhlwgmb.supabase.co/storage/v1/object/public/cms-media/<file>`. The migration script detects this exact URL pattern and rewrites it to the new Firebase Storage public URL for the same filename. All other `image` values (e.g. `/paro-taksang.jpg`) are frontend static assets and are left untouched.

## Migration Script

One-off script, not part of the running app, deleted after use (or kept under `backend/scripts/` but never invoked by the server):

1. Restore `databasedoc/db_cluster.sql` into a throwaway local Postgres via Docker (`docker run postgres:17` + `psql -f db_cluster.sql`) rather than hand-parsing the dump's tab-delimited `COPY` blocks — the JSONB columns contain raw commas/quotes/backslashes that a hand-rolled parser risks corrupting.
2. Node script connects to that local Postgres with `pg`, reads each of the 7 `public.*` tables with correct native types (JSONB already parsed to JS objects by `pg`).
3. For each row, write a corresponding Firestore document via `firebase-admin`'s batched writes (`WriteBatch`), applying the URL-rewrite rule above where applicable.
4. Upload the 20 files from `databasedoc/sahdrcajbflinfhlwgmb/cms-media/` to Firebase Storage under `cms-media/`, making them public the same way the Supabase bucket was public.
5. Tear down the Docker container.
6. Spot-check: print row counts written per collection and confirm they match source counts (6/3/13/4/4/3/0).

## Backend Code Changes

- Add `firebase-admin` dependency; remove `pg` (no longer needed once the one-off migration script has run — the script itself can use a scratch dependency or the same `pg` before it's removed, order: run migration first, then strip `pg` from `package.json`).
- Initialize `firebase-admin` once at startup from `FIREBASE_SERVICE_ACCOUNT` (parsed JSON) + `FIREBASE_STORAGE_BUCKET`.
- Replace `supabaseFetch()` with thin Firestore helpers (get collection / get doc / set / update / delete) used by each route handler; replace `uploadToSupabaseStorage()` with a Firebase Storage upload helper returning a public URL. Keep the existing local-`public/uploads/` fallback behavior for non-production environments.
- No route paths, request bodies, or response JSON shapes change.
- Delete dead code made obsolete by this migration: `backend/src/db.ts`, `backend/src/seed.ts` (direct-Postgres path already unused by the live server, only used by the old seeding flow), `backend/schema.sql` (superseded by Firestore, no longer the source of truth).

## Config Changes

- Remove: `SUPABASE_URL`, `SUPABASE_KEY`, `DATABASE_URL` from `backend/.env`.
- Add: `FIREBASE_SERVICE_ACCOUNT`, `FIREBASE_STORAGE_BUCKET`.
- Create `backend/.env.example` (didn't exist before) documenting all required vars: `FIREBASE_SERVICE_ACCOUNT`, `FIREBASE_STORAGE_BUCKET`, `PORT`, `ADMIN_API_KEY`.
- Update the same vars in the Vercel project settings for the backend deployment.

## Security Side-Fixes (opportunistic, in scope since touching these files anyway)

- `.gitignore`: add `databasedoc/` (contains the raw DB backup — schema allows PII even though today's `tourists` table is empty) and confirm `.env.development`/`.env.production` patterns are covered (currently only `.env`, `.env.local`, `.env.*.local` are ignored — `.env.development` is NOT covered and is tracked in git with a live Supabase key).
- Untrack `.env.development` from git (`git rm --cached`) and extend `.gitignore` to cover it.
- Rotating the old Supabase key is not necessary since the project is being abandoned entirely, but we stop committing secrets going forward.

## Testing

- After migration script runs: verify Firestore collection counts match source table counts exactly (6/3/13/4/4/3/0).
- Start the backend locally against the new Firebase project; exercise each route (`GET`/`POST`/`PUT`/`DELETE` for destinations, tours, hotels; `GET`/`PUT` for about/contact/testimonials; upload endpoint) and confirm responses match the shapes the frontend expects.
- Run the existing frontend against the migrated backend and manually click through: homepage, destination detail, tour detail/booking tabs, admin dashboard CRUD for each entity, image upload in admin.
- Confirm the 6 rewritten image URLs load correctly from Firebase Storage.

## Rollout

No live-traffic cutover risk — the Supabase project is already paused, so there is no concurrent production traffic to cut over. Sequence: create Firebase project → run migration script once → update backend code → update env vars (local + Vercel) → deploy → smoke test → hand the Firebase project over to the client.

## Out of Scope

- Supabase Auth, Realtime, Edge Functions, RPC — none are used, nothing to migrate.
- The 4 unused Storage buckets (`tour-assets`, `destination-assets`, `user-profiles`, `documents`) — empty, not recreated in Firebase.
- Any change to frontend code — it never talks to Supabase/Firebase directly.
