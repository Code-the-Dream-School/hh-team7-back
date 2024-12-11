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
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'attended'), 
    defaultValue: 'pending',
    allowNull: false,
    validate: {
      isIn: [['pending', 'confirmed', 'cancelled', 'attended']]  // Ensure status is one of the valid values
    }
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'completed', 'refunded'),
    allowNull: true,
    validate: {
      isIn: [['pending', 'completed', 'refunded']]  // Ensure payment_status is one of the valid values
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
