import { pool } from "./createTables";

export async function getHighscores() {
  try {
    const client = await pool.connect();
    const highscores = await client.query(`
        SELECT user_name, total_points, created_at
        FROM game
        ORDER BY total_points DESC
      `);
    client.release();
    return highscores.rows;
  } catch (error) {
    console.error("Error fetching highscores:", error);
    throw new Error("Internal Server Error");
  }
}

export async function createHighscore(user_name: string, total_points: number) {
  try {
    const client = await pool.connect();
    const query = `
        INSERT INTO game (user_name, total_points) 
        VALUES ($1, $2)
      `;
    await client.query(query, [user_name, total_points]);

    client.release();
  } catch (error) {
    console.error("Error creating highscore:", error);
    throw new Error("Internal Server Error");
  }
}
