"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const db_1 = require("./db");
const seed = async () => {
    try {
        const schemaPath = path_1.default.join(process.cwd(), 'schema.sql');
        const sql = fs_1.default.readFileSync(schemaPath, 'utf8');
        console.log('Reading schema.sql...');
        console.log('Connecting to database...');
        const client = await db_1.pool.connect();
        console.log('Executing SQL DDL...');
        await client.query(sql);
        console.log('Database seeded successfully!');
        client.release();
    }
    catch (err) {
        console.error('Error seeding database:', err);
    }
    finally {
        await db_1.pool.end();
    }
};
seed();
