import fs from "fs";
import { pool } from "./connectPool";

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
