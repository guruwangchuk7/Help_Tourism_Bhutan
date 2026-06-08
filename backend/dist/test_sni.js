"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
const test = async () => {
    const client = new pg_1.default.Client({
        host: 'aws-0-ap-southeast-1.pooler.supabase.com',
        port: 5432,
        user: 'postgres.sahdrcajbflinfhlwgmb',
        password: '@Bboyingguru7',
        database: 'postgres',
        ssl: {
            rejectUnauthorized: false
        }
    });
    try {
        console.log('Connecting via port 5432 pooler...');
        await client.connect();
        console.log('SUCCESS! Connected using port 5432 pooler!');
        await client.end();
    }
    catch (err) {
        console.error('Connection failed:', err);
    }
};
test();
