const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const StaffHero = sequelize.define(
  "StaffHero",
  {
    badge: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Meet the Ethiopian Team",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "The Heart Behind STEMpower Ethiopia",
    },
    subtitle: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "staff_heroes",
    timestamps: true,
  }
);

module.exports = StaffHero;
