const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const FabLabServiceHero = require("./FabLabServiceHero");

const FabLabService = sequelize.define(
  "FabLabService",
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    icon: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment:
        "Icon name from lucide-react (e.g., 'printer', 'zap', 'cpu', 'circuitboard', 'wrench')",
    },
    capabilities: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: "Array of capability strings",
    },
    applications: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: "Array of application strings",
    },
    specs: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
      comment:
        "Object with spec key-value pairs (e.g., {precision: '±0.1mm', materials: 'Multiple'})",
    },
    badge_title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    badge_icon: {
      type: DataTypes.STRING(255),
      allowNull: true, // e.g., icon class name or image path
    },
    service_overview: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    whats_included: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "fablab_services",
    timestamps: true,
  }
);

// Relationship: Hero → many Services
FabLabServiceHero.hasMany(FabLabService, {
  foreignKey: "heroId",
  onDelete: "CASCADE",
});
FabLabService.belongsTo(FabLabServiceHero, {
  foreignKey: "heroId",
});

module.exports = FabLabService;
