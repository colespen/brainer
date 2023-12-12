import fs from "fs";
import { pool } from "./connectPool";

export async function createTables() {
  const client = await pool.connect();
  try {
    const seedQuery = fs.readFileSync(`${__dirname}/seed.sql`, {
      encoding: "utf8",
    });
    const res = await client.query(seedQuery);
    console.log("Table Created: \n", res);
  } catch (error) {
    console.error("Error creating / seeding tables:", error);
  } finally {
    client.release();
  }
}
