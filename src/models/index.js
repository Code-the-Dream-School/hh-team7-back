const sequelize = require('../config/db');
const User = require('./user');
const Event = require('./event');
const Registration = require('./registration');

User.belongsToMany(Event, { through: Registration });
Event.belongsToMany(User, { through: Registration });

User.hasMany(Registration);
Registration.belongsTo(User, { as: "attendant", foreignKey: "UserId",});

Event.hasMany(Registration);
Registration.belongsTo(Event);

Event.belongsTo(User, { as: "organizer", foreignKey: "organizerId" });
User.hasMany(Event, { foreignKey: 'organizerId' });

module.exports = {
  sequelize,
  User,
  Event,
  Registration
};