const { Sequelize } = require('sequelize');
require('dotenv').config();  

// // MySQL
// const sequelize = new Sequelize(
//   `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:3306/${process.env.DB_NAME}`,
//   {
//     dialect: 'mysql',
//     logging: console.log  //false,  // turn off SQL-log
//   }
// );

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const dbPort = process.env.DB_PORT || 5432; 
const dbSSL = process.env.DB_SSL === 'true'; 

// PostgreSQL
const sequelize = new Sequelize(
  `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?ssl=${dbSSL}`,
  {
    dialect: 'postgres',
    logging: console.log,  // Optional, set to false to disable logging
    ssl: {
      require: dbSSL,         // Ensure SSL is enabled
      rejectUnauthorized: dbSSL,  // If using a hosted database that requires SSL (common for cloud databases)
    }
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;