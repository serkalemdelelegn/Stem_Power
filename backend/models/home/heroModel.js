const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Hero = sequelize.define(
  "Hero",
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    subtitle: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    cta: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ctaSecondary: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    stat1Label: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    stat1Value: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    stat2Label: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    stat2Value: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    stat3Label: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    stat3Value: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "hero_sections",
    timestamps: true,
  }
);

module.exports = Hero;
