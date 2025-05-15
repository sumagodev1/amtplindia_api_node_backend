const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ClientSlider = sequelize.define(
  "clientslider",
  {
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isDelete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = ClientSlider;
