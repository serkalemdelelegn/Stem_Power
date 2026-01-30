const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const FabLabProductHero = require("./FabLabProductHero");

const FabLabProductStat = sequelize.define(
  "FabLabProductStat",
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "fablab_product_stats",
    timestamps: true,
  }
);

// Relationship: Hero → many Stats
FabLabProductHero.hasMany(FabLabProductStat, {
  foreignKey: "heroId",
  onDelete: "CASCADE",
});
FabLabProductStat.belongsTo(FabLabProductHero, {
  foreignKey: "heroId",
});

module.exports = FabLabProductStat;
