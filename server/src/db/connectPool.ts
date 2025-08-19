import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// export const pool = new Pool({
//   user: process.env.DB_USER_PROD,
//   password: process.env.DB_PASSWORD_PROD,
//   database: process.env.DB_DATABASE_PROD,
//   host: process.env.DB_HOST_PROD,
//   port: Number(process.env.DB_PORT_PROD),
//   ssl: true
// });
export const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
});
