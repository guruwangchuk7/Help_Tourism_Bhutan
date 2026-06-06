import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Use DATABASE_URL if available, otherwise build connection from details
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/helptourism';

export const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle pg client', err);
});
