const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const FabLabProductHero = require("./FabLabProductHero");

const FabLabProduct = sequelize.define(
  "FabLabProduct",
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true, // URL or file path
    },
    status: {
      type: DataTypes.ENUM("in stock", "out of stock", "coming soon"),
      allowNull: false,
      defaultValue: "in stock",
    },
    product_overview: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    whats_included: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "fablab_products",
    timestamps: true,
  }
);

// Relationship: Hero → many Products
FabLabProductHero.hasMany(FabLabProduct, {
  foreignKey: "heroId",
  onDelete: "CASCADE",
});
FabLabProduct.belongsTo(FabLabProductHero, {
  foreignKey: "heroId",
});

module.exports = FabLabProduct;
