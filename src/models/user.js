const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require("bcryptjs");
const { ROLES } = require("../config/enums");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      validate: {
        len: [3, 50],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 100],
      },
    },
    role: {
      type: DataTypes.ENUM(...Object.values(ROLES)),
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt();
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeBulkCreate: async (users, options) => {
        for (const user of users) {
          const salt = await bcrypt.genSalt();
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
    indexes: [
      {
        unique: true,
        fields: ["email"],
      },
    ],
  }
);

//Creates User test data
const userBulkCreate = async () => {
  await sequelize.sync();
  await User.bulkCreate([
    {
      name: "organizer test",
      email: "alejandro7120@gmail.com",
      password: "test1234!",
      role: ROLES.ORGANIZER,
    },
    {
      name: "attendee test",
      email: "cristian.rosales@unet.edu.ve",
      password: "test1234!",
      role: ROLES.ATTENDEE,
    },
  ]);
};
// userBulkCreate();

module.exports = User;
