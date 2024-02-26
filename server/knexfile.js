

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';


const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });



const certificatePath = path.join("C:", "Users", "Ritesh", "Downloads", "ca-certificate.crt");



console.log(certificatePath);
console.log(`The password of ${process.env.NODE_ENV} is ${process.env.DB_PASSWORD}`);

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
