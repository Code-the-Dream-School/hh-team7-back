const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');  


const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,  // email validation
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('organizer', 'attendee'),
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nickname: {
    type: DataTypes.STRING,
    defaultValue: "none",
  },
  zipcode: {
    type: DataTypes.STRING,
    defaultValue: "000000",
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  last_login: DataTypes.DATE,
  profile_picture_url: DataTypes.STRING,
  phone_number: DataTypes.STRING,
  bio: DataTypes.TEXT,
  created_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  modified_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false
});

module.exports = User;