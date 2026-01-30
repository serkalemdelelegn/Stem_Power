const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const AboutStemCenter = sequelize.define(
  "AboutStemCenter",
  {
    // Hero section
    badge: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "About STEMpower Ethiopia",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "Inside Every Child is a Scientist",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    statistic: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "61",
    },
    // Who We Are section (stored as JSON)
    whoWeAre: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        badge: "Our Story",
        title: "Who We Are",
        description: "",
        image: "",
      },
    },
    // Mission & Vision
    mission: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    vision: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Values (stored as JSON array)
    values: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "about_stem_centers",
    timestamps: true,
  }
);

module.exports = AboutStemCenter;
