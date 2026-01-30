const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Footer = sequelize.define(
  "Footer",
  {
    logo: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "/STEMpower_s_logo.png",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    copyrightText: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    contactEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    contactPhone: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    contactAddress: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: "footer",
    timestamps: true,
  }
);

module.exports = Footer;
