const sequelize = require('../config/db');
const User = require('./user');
const Event = require('./event');
const Registration = require('./registration');

User.belongsToMany(Event, { through: Registration });
Event.belongsToMany(User, { through: Registration });

User.hasMany(Registration);
Registration.belongsTo(User);

Event.hasMany(Registration);
Registration.belongsTo(Event);

module.exports = {
  sequelize,
  User,
  Event,
  Registration
};