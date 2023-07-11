"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = void 0;
const pg_1 = require("pg");
// Create a new PostgreSQL pool
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
// Function to execute a SQL query
const query = (text, params = []) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield pool.connect();
    try {
        const result = yield client.query(text, params);
        return result.rows;
    }
    finally {
        client.release();
    }
});
exports.query = query;
