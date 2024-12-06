const sequelize = require('../config/db');
const User = require('./user');
const Event = require('./event');
const Registration = require('./registration');

// Define associations
User.hasMany(Event, { foreignKey: 'organizerid' });
Event.belongsTo(User, { foreignKey: 'organizerid' });

User.hasMany(Registration, { foreignKey: 'userid' });
Registration.belongsTo(User, { foreignKey: 'userid' });

Event.hasMany(Registration, { foreignKey: 'eventid' });
Registration.belongsTo(Event, { foreignKey: 'eventid' });

User.belongsToMany(Event, { through: Registration });
Event.belongsToMany(User, { through: Registration });



module.exports = {
  sequelize,
  User,
  Event,
  Registration
};