const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { REGISTRATION_STATUS } = require("../config/enums");
const Event = require('./event');

const Registration = sequelize.define(
  "Registration",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      primaryKey: true,
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "events",
        key: "id",
      },
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(REGISTRATION_STATUS)),
      defaultValue: REGISTRATION_STATUS.CONFIRMED,
      allowNull: false,
      validate: {
        isIn: [Object.values(REGISTRATION_STATUS)],
      },
    },
    checkInTime: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true,
      },
    },
  },
  {
    tableName: "registrations",
    timestamps: true,
    hooks: {
      afterValidate: async (registration, options) => {
        if (registration.checkInTime) {
          
          const event = await Event.findByPk(registration.EventId);
          if (!event) {
            throw new Error("Event not found for the provided EventId");
          }
          if (registration.checkInTime < event.date) {
            throw new Error("Check-in time must be on or after the event date");
          }
        }
      },
    },
    indexes: [
      {
        unique: true,
        fields: ["UserId", "EventId"],
      },
    ],
  }
);

module.exports = Registration;
