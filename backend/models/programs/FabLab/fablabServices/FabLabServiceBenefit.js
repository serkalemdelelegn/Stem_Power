const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const FabLabServiceHero = require("./FabLabServiceHero");

const FabLabServiceBenefit = sequelize.define(
  "FabLabServiceBenefit",
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "users",
      comment:
        "Icon name from lucide-react (e.g., 'users', 'shield', 'graduationcap', 'lightbulb')",
    },
  },
  {
    tableName: "fablab_service_benefits",
    timestamps: true,
  }
);

// Relationships
FabLabServiceHero.hasMany(FabLabServiceBenefit, {
  foreignKey: "heroId",
  onDelete: "CASCADE",
});
FabLabServiceBenefit.belongsTo(FabLabServiceHero, {
  foreignKey: "heroId",
});

module.exports = FabLabServiceBenefit;
