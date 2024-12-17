const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require("bcryptjs");
const roles = require('../config/roles');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,  // Ensures the email is unique
    validate: {
      len: [3, 50]  // Name should be between 3 and 50 characters
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,  // Ensures email format validation
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100]  // Password length should be between 6 and 100 characters
    }
  },
  role: {
    type: DataTypes.ENUM(roles.ORGANIZER, roles.ATTENDEE),
    allowNull: false,
    validate: {
      isIn: [[roles.ORGANIZER, roles.ATTENDEE]]  // Role must be either 'organizer' or 'attendee'
    }
  },
  created_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  modified_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
}, {
  tableName: 'users',
  timestamps: false,  
  hooks: {
    beforeUpdate: (user, options) => {
      user.modified_date = new Date();
    },
    beforeCreate: async (user, options) => {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(user.password, salt);
    } 
  }
});


module.exports = User;
