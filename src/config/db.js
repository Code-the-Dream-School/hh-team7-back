const { Sequelize } = require('sequelize');
require('dotenv').config();  // from .env

// MySQL
const sequelize = new Sequelize(
  `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:3306/${process.env.DB_NAME}`,
  {
    dialect: 'mysql',
    logging: console.log  //false,  // turn off SQL-log
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