const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const FabLabServiceHero = require("./FabLabServiceHero");

const FabLabServiceStat = sequelize.define(
  "FabLabServiceStat",
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment:
        "Icon name from lucide-react (e.g., 'factory', 'lightbulb', 'users', 'shield')",
    },
  },
  {
    tableName: "fablab_service_stats",
    timestamps: true,
  }
);

// Relationship: Hero → many Stats
FabLabServiceHero.hasMany(FabLabServiceStat, {
  foreignKey: "heroId",
  onDelete: "CASCADE",
});
FabLabServiceStat.belongsTo(FabLabServiceHero, {
  foreignKey: "heroId",
});

module.exports = FabLabServiceStat;
