const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user'); 
const Event = require('./event'); 

const Registration = sequelize.define('Registration', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', 
      key: 'id'
    },
    field: 'userid' 
  },
  eventid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'events', 
      key: 'id'
    },
    field: 'eventid' 
  },
  registration_date: {
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'attended'), 
    defaultValue: 'pending',
    allowNull: false
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'completed', 'refunded'),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT, 
    allowNull: true
  },
  check_in_time: {
    type: DataTypes.DATE, 
    allowNull: true
  }
}, {
  tableName: 'registrations', 
  timestamps: false, 
});

module.exports = Registration;
