const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const FabLabService = require("./FabLabService");

const FabLabServiceFeature = sequelize.define(
  "FabLabServiceFeature",
  {
    feature: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "fablab_service_features",
    timestamps: true,
  }
);

// Relationship: Service → many Features
FabLabService.hasMany(FabLabServiceFeature, {
  foreignKey: "serviceId",
  onDelete: "CASCADE",
});
FabLabServiceFeature.belongsTo(FabLabService, {
  foreignKey: "serviceId",
});

module.exports = FabLabServiceFeature;
