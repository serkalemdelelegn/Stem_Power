const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const BusinessDevelopmentService = sequelize.define(
  "BusinessDevelopmentService",
  {
    badge: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "Business Development",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Business Development Services",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "Comprehensive support for entrepreneurs...",
    },
  },
  {
    tableName: "business_development_services",
    timestamps: true,
  }
);

module.exports = BusinessDevelopmentService;
