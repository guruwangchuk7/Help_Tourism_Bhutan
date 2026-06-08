"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
const regions = [
    'ap-southeast-1', 'ap-southeast-2', 'ap-south-1', 'ap-northeast-1', 'ap-northeast-2',
    'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
    'eu-central-1', 'eu-central-2', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-north-1',
    'sa-east-1', 'ca-central-1'
];
const testConnection = async (host) => {
    const connectionString = `postgresql://postgres.sahdrcajbflinfhlwgmb:%40Bboyingguru7@${host}:6543/postgres`;
    const client = new pg_1.default.Client({ connectionString });
    try {
        await client.connect();
        console.log(`\n🎉 FOUND IT! Host is: ${host}`);
        await client.end();
        return true;
    }
    catch (err) {
        if (err.message.includes('password authentication failed') || err.message.includes('authentication failed')) {
            console.log(`\n🎉 FOUND IT! Host is: ${host} (Tenant found, password check passed or failed)`);
            await client.end();
            return true;
        }
        // Tenant not found or network error
        process.stdout.write('.');
        return false;
    }
};
const scan = async () => {
    console.log('Scanning Supabase pooler regions for tenant sahdrcajbflinfhlwgmb...');
    for (const r of regions) {
        const host1 = `aws-0-${r}.pooler.supabase.com`;
        if (await testConnection(host1))
            return;
        const host2 = `aws-${r}.pooler.supabase.com`;
        if (await testConnection(host2))
            return;
    }
    console.log('\nScan complete. No host found.');
};
scan();
