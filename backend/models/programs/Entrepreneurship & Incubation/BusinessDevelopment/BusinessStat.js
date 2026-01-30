const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const BusinessDevelopmentService = require("./BusinessDevelopmentService");

const BusinessStat = sequelize.define(
  "BusinessStat",
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
    tableName: "business_stats",
    timestamps: true,
  }
);

// Relationship
BusinessDevelopmentService.hasMany(BusinessStat, {
  foreignKey: "businessDevServiceId",
  onDelete: "CASCADE",
});
BusinessStat.belongsTo(BusinessDevelopmentService, {
  foreignKey: "businessDevServiceId",
});

module.exports = BusinessStat;
