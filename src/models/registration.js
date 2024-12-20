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
    field: 'userid',
    validate: {
      isInt: true  // Ensure 'userid' is an integer
    } 
  },
  eventid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'events', 
      key: 'id'
    },
    field: 'eventid',
    validate: {
      isInt: true  // Ensure 'eventid' is an integer
    } 
  },
  registration_date: {
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  },
  status: {
    type: DataTypes.ENUM('Confirmed', 'Cancelled'), 
    defaultValue: 'Confirmed',
    allowNull: false,
    validate: {
      isIn: [['Confirmed', 'Cancelled']]  // Ensure status is one of the valid values
    }
  },
  payment_status: {
    type: DataTypes.ENUM('Pending', 'Completed', 'Refunded'),
    allowNull: true,
    validate: {
      isIn: [['Pending', 'Completed', 'Refunded']]  // Ensure payment_status is one of the valid values
    }
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
