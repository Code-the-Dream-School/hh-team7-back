const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');  
const Registration = require('./registration');  

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: DataTypes.TEXT,
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'cancelled', 'completed'),
    defaultValue: 'draft'
  },
  event_type: {
    type: DataTypes.ENUM('in-person', 'virtual', 'hybrid'),
    defaultValue: 'in-person'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  registration_deadline: DataTypes.DATE,
  min_capacity: DataTypes.INTEGER,
  max_capacity: DataTypes.INTEGER,
  is_private: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  venue_details: DataTypes.TEXT,
  event_banner_url: DataTypes.STRING,
  organizerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // It should match the table name in the database, which is 'Users' or 'users' based on case sensitivity.
      key: 'id'
    }
  },
  created_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  modified_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
    timestamps: false
  });

// Define associations
// User.hasMany(Event, { foreignKey: 'organizerId' });
// Event.belongsTo(User, { foreignKey: 'organizerId' });

// // Many-to-many relationship through Registration table
// User.belongsToMany(Event, { through: Registration });
// Event.belongsToMany(User, { through: Registration });

// Export the Event model
module.exports = Event;
