const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const FabLabProduct = require("./FabLabProduct");

const FabLabProductApplication = sequelize.define(
  "FabLabProductApplication",
  {
    application: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "fablab_product_applications",
    timestamps: true,
  }
);

// Relationship: Product → many Applications
FabLabProduct.hasMany(FabLabProductApplication, {
  foreignKey: "productId",
  onDelete: "CASCADE",
});
FabLabProductApplication.belongsTo(FabLabProduct, {
  foreignKey: "productId",
});

module.exports = FabLabProductApplication;
