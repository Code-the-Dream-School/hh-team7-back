const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Registration = sequelize.define(
  "Registration",
  {
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      primaryKey: true,
    },
    eventid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "events",
        key: "id",
      },
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
      defaultValue: "pending",
      allowNull: false,
      validate: {
        isIn: [["pending", "confirmed", "cancelled"]],
      },
    },
    check_in_time: {
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
