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
    allowNull: false,
    validate: {
      len: [3, 100]  // Event name must be between 3 and 100 characters
    }
  },
  description: {
    type: DataTypes.TEXT,
    validate: {
      len: [0, 1000]  // Description should be between 0 and 1000 characters
    }
  },
  date: {
    type: DataTypes.DATE,  
    allowNull: false,
    validate: {
      isDate: true  // Ensures the 'date' field contains a valid date
    }
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 100]  // Location must be between 3 and 100 characters
    }
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,  // Ensures capacity is an integer
      min: 1        // Capacity must be at least 1
    }
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Published', 'Canceled', 'Completed'),
    defaultValue: 'Draft'
  },
  event_type: {
    type: DataTypes.ENUM('In-person', 'Virtual', 'Hybrid'),
    defaultValue: 'In-person'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),  
    defaultValue: 0.00
  },
  registration_deadline: DataTypes.DATE,  
  min_capacity: {
    type: DataTypes.INTEGER,
    validate: {
      isInt: true,
      min: 0  // Minimum capacity cannot be negative
    }
  },
  max_capacity: {
    type: DataTypes.INTEGER,
    validate: {
      isInt: true,
      min: 1  // Maximum capacity must be at least 1
    }
  },
  is_private: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  venue_details: DataTypes.TEXT,  
  event_banner_url: DataTypes.STRING,
  organizerid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', 
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
  tableName: 'events',
  timestamps: false  
});


module.exports = Event;
