const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const ImpactDashboard = sequelize.define(
  "ImpactDashboard",
  {
    program_participation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    stem_centers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    events_held: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "impact_dashboard",
    timestamps: true,
  }
);

module.exports = ImpactDashboard;
