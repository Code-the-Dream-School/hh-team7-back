const sequelize = require('../config/db');
const User = require('./user');
const Event = require('./event');
const Registration = require('./registration');

// Define associations
// User.hasMany(Event, { foreignKey: 'organizerId' });
// Event.belongsTo(User, { foreignKey: 'organizerId' });

// User.hasMany(Registration, { foreignKey: 'userId' });
// Registration.belongsTo(User, { foreignKey: 'userId' });

// Event.hasMany(Registration, { foreignKey: 'eventId' });
// Registration.belongsTo(Event, { foreignKey: 'eventId' });

// User.belongsToMany(Event, { through: Registration });
// Event.belongsToMany(User, { through: Registration });


// Export models
module.exports = {
  sequelize,
  User,
  Event,
  Registration
};