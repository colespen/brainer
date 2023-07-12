import { Pool } from "pg";
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
    await client.query(`
      CREATE TABLE IF NOT EXISTS game (
        game_id SERIAL PRIMARY KEY,
        user_name VARCHAR(255) NOT NULL,
        total_points INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Tables created successfully.");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    client.release();
  }
}
export async function dropTables() {
  const client = await pool.connect();
  try {
    await client.query(`
        DROP TABLE IF EXISTS highscore
      `);

    await client.query(`
        DROP TABLE IF EXISTS game
      `);

    console.log("Tables dropped successfully.");
  } catch (error) {
    console.error("Error dropping tables:", error);
  } finally {
    client.release();
  }
}
