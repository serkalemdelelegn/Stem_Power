const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const FabLabService = require("./FabLabService");

const FabLabServiceApplication = sequelize.define(
  "FabLabServiceApplication",
  {
    application: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "fablab_service_applications",
    timestamps: true,
  }
);

// Relationship: Service → many Applications
FabLabService.hasMany(FabLabServiceApplication, {
  foreignKey: "serviceId",
  onDelete: "CASCADE",
});
FabLabServiceApplication.belongsTo(FabLabService, {
  foreignKey: "serviceId",
});

module.exports = FabLabServiceApplication;
