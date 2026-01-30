const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const StemCenterHero = sequelize.define(
  "StemCenterHero",
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "STEM Centers",
    },
    subtitle: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hero_image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: "stem_center_heroes",
    timestamps: true,
  }
);

module.exports = StemCenterHero;
