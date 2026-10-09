import dotenv from 'dotenv';
dotenv.config();

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
