"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
const test = async () => {
    const client = new pg_1.default.Client({
        host: 'db.sahdrcajbflinfhlwgmb.supabase.co',
        port: 5432,
        user: 'postgres',
        password: '@Bboyingguru7',
        database: 'postgres',
        ssl: {
            rejectUnauthorized: false
        }
    });
    try {
        console.log('Connecting directly to db.sahdrcajbflinfhlwgmb.supabase.co on port 5432...');
        await client.connect();
        console.log('SUCCESS! Connected directly via PostgreSQL!');
        const res = await client.query('SELECT tablename FROM pg_tables WHERE schemaname = \'public\'');
        console.log('Tables in public schema:', res.rows.map(r => r.tablename));
        await client.end();
    }
    catch (err) {
        console.error('Direct pg connection failed:', err);
    }
};
test();
