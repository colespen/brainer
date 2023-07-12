import { Pool } from "pg";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
});

export async function createTables() {
  const client = await pool.connect();
  try {
    const seedQuery = fs.readFileSync(`${__dirname}/seed.sql`, {
      encoding: "utf8",
    });
    pool.query(seedQuery, (err, res) => {
      console.log(err, res);
      console.log("Seeding Completed!");
      // pool.end();
    });
  } catch (error) {
    console.error("Error creating / seeding tables:", error);
  } finally {
    client.release();
  }
}
