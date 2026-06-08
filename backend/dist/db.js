"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = __importDefault(require("pg"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { Pool } = pg_1.default;
// Use DATABASE_URL if available, otherwise build connection from details
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/helptourism';
exports.pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
});
exports.pool.on('error', (err) => {
    console.error('Unexpected error on idle pg client', err);
});
