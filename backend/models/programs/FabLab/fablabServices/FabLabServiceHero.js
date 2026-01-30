const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const FabLabServiceHero = sequelize.define(
  "FabLabServiceHero",
  {
    badge: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Advanced Tools for Innovation",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "FabLab Services",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue:
        "Our FabLab features advanced tools like 3D printers, laser cutters, CNC machines, soldering stations, and electronics benches—perfect for prototyping, product development, and hands-on STEM learning.",
    },
    subtitle: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Legacy field, use description instead",
    },
  },
  {
    tableName: "fablab_service_heroes",
    timestamps: true,
  }
);

module.exports = FabLabServiceHero;
