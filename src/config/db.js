const { Sequelize } = require('sequelize');
require('dotenv').config();  // from .env

// // MySQL
// const sequelize = new Sequelize(
//   `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:3306/${process.env.DB_NAME}`,
//   {
//     dialect: 'mysql',
//     logging: console.log  //false,  // turn off SQL-log
//   }
// );

// PostgreSQL
const sequelize = new Sequelize(
  `postgresql://my_table_k6on_user:DTAaPvcWGtE1ZcI4WMovj7CxdazUBL7d@dpg-ct6jf5ilqhvc73ap60u0-a.oregon-postgres.render.com/my_table_k6on?ssl=true`,
  // `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
  {
    dialect: 'postgres',
    logging: console.log,  // Optional, set to false to disable logging
    ssl: {
      require: true,         // Ensure SSL is enabled
      rejectUnauthorized: false,  // If using a hosted database that requires SSL (common for cloud databases)
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