const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Event = sequelize.define(
  "Event",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 100],
      },
    },
    description: {
      type: DataTypes.TEXT,
      validate: {
        len: [0, 1000],
      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 100],
      },
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 1,
      },
    },
    status: {
      type: DataTypes.ENUM('Draft', 'Published', 'Canceled', 'Completed'),
      defaultValue: 'Draft'
    },
    eventType: {
      type: DataTypes.ENUM('In-person', 'Virtual', 'Hybrid'),
      defaultValue: 'In-person'
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },
    registrationDeadline: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isBeforeOrSameDay(value) {
          if (value > this.date) {
            throw new Error(
              "Registration deadline must be on or before the event date"
            );
          }
        },
      },
    },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    eventBannerUrl: DataTypes.STRING,
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    tableName: "events",
    timestamps: true,
  }
);

module.exports = Event;
