const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const IncubationHero = sequelize.define(
  "IncubationHero",
  {
    badge: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "Entrepreneurship & Incubation",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Incubation Program",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue:
        "Transform your innovative ideas into successful, sustainable ventures with comprehensive support, mentorship, and resources.",
    },
  },
  {
    tableName: "incubation_heroes",
    timestamps: true,
  }
);

module.exports = IncubationHero;
