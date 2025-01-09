const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { EVENT_STATUS, EVENT_TYPE } = require("../config/enums");

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
      type: DataTypes.ENUM(...Object.values(EVENT_STATUS)),
      defaultValue: EVENT_STATUS.DRAFT
    },
    eventType: {
      type: DataTypes.ENUM(...Object.values(EVENT_TYPE)),
      defaultValue: EVENT_TYPE.IN_PERSON
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

//Creates Event test data
const eventBulkCreate = async () => {
  await sequelize.sync();
  await Event.bulkCreate([
    {
      organizerId: 1,
      name: "Event test 1",
      description: "Test description",
      date: "01/31/2025",
      location: "Test Location",
      capacity: "10",
      status: "Draft",
      eventType: "Virtual",
      price: "10.00",
      registrationDeadline: "01/31/2025",
      isPrivate: "false",
    },
    {
      organizerId: 1,
      name: "Event test 2",
      description: "Test description",
      date: "03/31/2025",
      location: "Test Location",
      capacity: "10",
      status: "Published",
      eventType: "In-person",
      price: "10.00",
      registrationDeadline: "03/30/2025",
      isPrivate: "true",
    },
  ]);
};
// eventBulkCreate();

module.exports = Event;
