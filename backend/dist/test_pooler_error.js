"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
const test = async () => {
    const client = new pg_1.default.Client({
        connectionString: 'postgresql://postgres.sahdrcajbflinfhlwgmb:%40Bboyingguru7@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
        ssl: { rejectUnauthorized: false }
    });
    try {
        console.log('Connecting to pooler on port 6543...');
        await client.connect();
        console.log('SUCCESS!');
        await client.end();
    }
    catch (err) {
        console.error('Error stack:', err.stack);
        console.error('Error message:', err.message);
    }
};
test();
