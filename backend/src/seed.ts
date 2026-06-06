import fs from 'fs';
import path from 'path';
import { pool } from './db';

const seed = async () => {
  try {
    const schemaPath = path.join(process.cwd(), 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    console.log('Reading schema.sql...');
    console.log('Connecting to database...');
    const client = await pool.connect();
    console.log('Executing SQL DDL...');
    await client.query(sql);
    console.log('Database seeded successfully!');
    client.release();
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await pool.end();
  }
};

seed();
