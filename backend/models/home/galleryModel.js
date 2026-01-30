const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Gallery = sequelize.define(
  "Gallery",
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    caption: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    media_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    participants: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "rotating_gallery",
    timestamps: true,
  }
);

module.exports = Gallery;
