// Update with your config settings.
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
// module.exports = {

//   development: {
//     client: 'sqlite3',
//     connection: {
//       filename: './dev.sqlite3'
//     }
//   },

//   staging: {
//     client: 'postgresql',
//     connection: {
//       database: 'my_db',
//       user:     'username',
//       password: 'password'
//     },
//     pool: {
//       min: 2,
//       max: 10
//     },
//     migrations: {
//       tableName: 'knex_migrations'
//     }
//   },

//   production: {
//     client: 'postgresql',
//     connection: {
//       database: 'my_db',
//       user:     'username',
//       password: 'password'
//     },
//     pool: {
//       min: 2,
//       max: 10
//     },
//     migrations: {
//       tableName: 'knex_migrations'
//     }
//   }

// };

const certificate = path.join("C:", "Users", "Ritesh", "Downloads", "ca-certificate.crt");
let sslConfig = {};

// const sslConfig = process.env.NODE_ENV === 'production' ? 
//   { ssl: { rejectUnauthorized: false } } : {};

if(process.env.NODE_ENV === 'production'){
  sslConfig = {
    ssl: {
      rejectUnauthorized: true,
      ca: fs.readFileSync(certificate).toString(), 
    },
  };
}

export default {
  development: {
    client: 'pg',
    connection: {
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      ...sslConfig,
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: process.env.DB_SERVER_DATABASE,
      user: process.env.DB_SERVER_USER,
      password: process.env.DB_SERVER_PASSWORD,
      host: process.env.DB_SERVER_HOST,
      port: process.env.DB_SERVER_PORT,
      ...sslConfig,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: process.env.DB_SERVER_DATABASE,
      user: process.env.DB_SERVER_USER,
      password: process.env.DB_SERVER_PASSWORD,
      host: process.env.DB_SERVER_HOST,
      port: process.env.DB_SERVER_PORT,
      // ssl: { rejectUnauthorized: false } // Assuming production requires SSL
      ...sslConfig
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