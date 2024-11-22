const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user'); // Import the User model
const Event = require('./event'); // Import the Event model

const Registration = sequelize.define('Registration', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false
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
  // Options
  tableName: 'registrations', // Set table name to match the SQL table
  timestamps: false, // We will manage created/updated times manually if necessary
});

// Define associations (Foreign Keys)
// Registration.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
// Registration.belongsTo(Event, { foreignKey: 'eventId', onDelete: 'CASCADE' });

// Export the Registration model
module.exports = Registration;