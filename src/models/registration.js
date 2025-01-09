const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { REGISTRATION_STATUS } = require("../config/enums");

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
        isAfterNow(value) {
          if (value && value < new Date()) {
            throw new Error("Check-in time must be in the future");
          }
        },
      },
    },
  },
  {
    tableName: "registrations",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "eventId"],
      },
    ],
  }
);

module.exports = Registration;
