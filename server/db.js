
import pkg from 'pg';
const { Pool } = pkg;
// require('dotenv').config();
import dotenv from 'dotenv';
dotenv.config();


// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'sessiondb',
//   password: '89999', // Ensure password is a string
//   port: 5432,
// });
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


export const query = (text, params) => pool.query(text, params);


