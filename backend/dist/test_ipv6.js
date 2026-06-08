"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const test = async () => {
    const connectionString = process.env.DATABASE_URL;
    console.log('Using connection string:', connectionString);
    const client = new pg_1.default.Client({
        connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });
    try {
        console.log('Connecting to IPv6 address...');
        await client.connect();
        console.log('SUCCESS! Connected to DB via IPv6 address!');
        const res = await client.query('SELECT tablename FROM pg_tables WHERE schemaname = \'public\'');
        console.log('Tables:', res.rows.map(r => r.tablename));
        await client.end();
    }
    catch (err) {
        console.error('Connection failed:', err.message);
    }
};
test();
