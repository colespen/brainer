import { Pool } from "pg";

// Create a new PostgreSQL pool

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Function to execute a SQL query
export const query = async (text: string, params: any[] = []) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows;
  } finally {
    client.release();
  }
};
