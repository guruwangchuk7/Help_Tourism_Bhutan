"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
const regions = [
    'ap-east-1', 'ap-south-2', 'ap-southeast-3', 'ap-southeast-4',
    'eu-south-1', 'eu-south-2', 'me-central-1', 'me-west-1', 'us-gov-west-1'
];
const testConnection = async (host) => {
    const connectionString = `postgresql://postgres.sahdrcajbflinfhlwgmb:%40Bboyingguru7@${host}:6543/postgres`;
    const client = new pg_1.default.Client({ connectionString });
    try {
        await client.connect();
        console.log(`SUCCESS: ${host}`);
        await client.end();
    }
    catch (err) {
        console.log(`FAIL: ${host} -> ${err.message}`);
        await client.end().catch(() => { });
    }
};
const scan = async () => {
    for (const r of regions) {
        await testConnection(`aws-0-${r}.pooler.supabase.com`);
        await testConnection(`aws-${r}.pooler.supabase.com`);
    }
};
scan();
