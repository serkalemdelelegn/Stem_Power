const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const BusinessDevelopmentService = require("./BusinessDevelopmentService");

const FundingPartner = sequelize.define(
  "FundingPartner",
  {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    logo: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    contribution_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    focus_area: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    partnership_duration: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    people_impacted: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "funding_partners",
    timestamps: true,
  }
);

// Relationship
BusinessDevelopmentService.hasMany(FundingPartner, {
  foreignKey: "businessDevServiceId",
  onDelete: "CASCADE",
});
FundingPartner.belongsTo(BusinessDevelopmentService, {
  foreignKey: "businessDevServiceId",
});

module.exports = FundingPartner;
