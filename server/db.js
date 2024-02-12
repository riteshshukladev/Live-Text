// const { Pool } = require('pg');
// Change the import syntax
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sessiondb',
  password: '89999', // Ensure password is a string
  port: 5432,
});

export const query = (text, params) => pool.query(text, params);


