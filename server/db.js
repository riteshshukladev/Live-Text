


import pkg from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
const { Pool } = pkg;

// template literal is used to config the .env file based on it's NODE_ENV varible , default = dev;

const envPath = `.env.${process.env.NODE_ENV || 'development'}`;
// setting the path
dotenv.config({path:envPath});


const certificatePath = path.join("C:", "Users", "Ritesh", "Downloads", "ca-certificate.crt");







const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: true,
    ca: fs.readFileSync(certificatePath).toString(),
  } : false,
})
export const query = (text, params) => pool.query(text, params);