


import pkg from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const { Pool } = pkg;

// template literal is used to config the .env file based on it's NODE_ENV varible , default = dev;
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CertificatePath = path.join(__dirname,'ssl','ca-certificate.crt');


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized:true,
    ca:fs.readFileSync(CertificatePath).toString(),
  },
})
export const query = (text, params) => pool.query(text, params);