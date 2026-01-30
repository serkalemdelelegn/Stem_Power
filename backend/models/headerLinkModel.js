const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HeaderLink = sequelize.define(
  "HeaderLink",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    label: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    children: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "header_links",
    timestamps: true,
  }
);

module.exports = HeaderLink;
