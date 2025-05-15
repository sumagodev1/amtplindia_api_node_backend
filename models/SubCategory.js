const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SubCategory = sequelize.define('subcategories', {
  project_category_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  project_category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subproject_category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
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
}, {
  timestamps: true,
});

module.exports = SubCategory;
