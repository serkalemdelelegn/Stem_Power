const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const FabLabProductHero = sequelize.define(
  "FabLabProductHero",
  {
    badge: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Empowering Africa's Next Generation Since 2010",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Celebrating Excellence",
    },
    subtitle: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "fablab_product_heroes",
    timestamps: true,
  }
);

module.exports = FabLabProductHero;
