

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });



// const certificatePath = path.join("C:", "Users", "Ritesh", "Downloads", "ca-certificate.crt");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const certificatePath = path.join( __dirname, 'ssl', 'ca-certificate.crt');


// const certificatePath = path.join(  "ssl", "ca-certificate.crt");



export default {
  development: {
    client: 'pg',
    connection: {
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      
    }
  },
 

  production: {
    client: 'postgresql',
    connection: {
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      // sslConfig,
      ssl:{
        rejectUnauthorized: true,
      ca: fs.readFileSync(certificatePath).toString(),
      }
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
