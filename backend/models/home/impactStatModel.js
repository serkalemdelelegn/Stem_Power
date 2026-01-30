const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const ImpactDashboard = require("./impactModel");

const ImpactStat = sequelize.define(
  "ImpactStat",
  {
    impact_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "impact_dashboard",
        key: "id",
      },
    },
    metric_key: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    icon: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    trend: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    display_value: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_extra: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sort_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "impact_stats",
    timestamps: true,
  }
);

ImpactDashboard.hasMany(ImpactStat, {
  as: "stats",
  foreignKey: "impact_id",
  onDelete: "CASCADE",
});
ImpactStat.belongsTo(ImpactDashboard, {
  foreignKey: "impact_id",
  as: "impact",
});

module.exports = ImpactStat;
