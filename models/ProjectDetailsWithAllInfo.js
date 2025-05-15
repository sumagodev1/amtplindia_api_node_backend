const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProjectDetailsWithAllInfo = sequelize.define(
  "project_details_with_all_info",
  {
    project_category_id: { type: DataTypes.STRING, allowNull: false },
    project_category: { type: DataTypes.STRING, allowNull: false },
    subproject_category_id: { type: DataTypes.STRING, allowNull: false },
    subproject_category: { type: DataTypes.STRING, allowNull: false },
    // unique: true
    project_type: { type: DataTypes.STRING, allowNull: false,unique: true },
    project_images: { type: DataTypes.JSON, allowNull: false, defaultValue: [] }, // Store multiple images
    // project_images: { type: DataTypes.STRING, allowNull: false },
    projectDesc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    projecttechnicalDesc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    technical_images: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },

    projectOverviewDesc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    overview_images: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },

    projectfeatureDesc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    feature_images: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },

    projectConventionalDesc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    conventional_images: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },

    projectAccessoriesDesc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    accessories_images: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },

    isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
    isDelete: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { timestamps: true }
);

module.exports = ProjectDetailsWithAllInfo;
