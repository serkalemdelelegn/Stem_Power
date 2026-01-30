const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const FabLabProduct = require("./FabLabProduct");

const FabLabProductFeature = sequelize.define(
  "FabLabProductFeature",
  {
    feature: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "fablab_product_features",
    timestamps: true,
  }
);

// Relationship: Product → many Features
FabLabProduct.hasMany(FabLabProductFeature, {
  foreignKey: "productId",
  onDelete: "CASCADE",
});
FabLabProductFeature.belongsTo(FabLabProduct, {
  foreignKey: "productId",
});

module.exports = FabLabProductFeature;
