import pkg from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
const { Pool } = pkg;
// require('dotenv').config();
dotenv.config();

const caPath = path.join("C:", "Users", "Ritesh", "Downloads", "ca-certificate.crt");

const pool = new Pool({
  // user: process.env.DB_USER,
  // host: process.env.DB_HOST,
  // database: process.env.DB_DATABASE,
  // password: process.env.DB_PASSWORD,
  // port: process.env.DB_PORT,

  user: process.env.DB_SERVER_USER,
  host: process.env.DB_SERVER_HOST,
  database: process.env.DB_SERVER_DATABASE,
  password: process.env.DB_SERVER_PASSWORD,
  port: process.env.DB_SERVER_PORT,
  ssl: {
    rejectUnauthorized: true,
    ca:fs.readFileSync(caPath).toString(),
  },
});

export const query = (text, params) => pool.query(text, params);
