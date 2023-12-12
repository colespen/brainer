import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  //   user: process.env.DB_USER,
  user: "postgres",
  //   password: process.env.DB_PASSWORD,
  password: "postgres",
  database: process.env.DB_DATABASE,
  //   host: process.env.DB_HOST,
  host: "memory-game.cxwtr0osvoxg.us-east-1.rds.amazonaws.com",
  port: Number(process.env.DB_PORT),
});
