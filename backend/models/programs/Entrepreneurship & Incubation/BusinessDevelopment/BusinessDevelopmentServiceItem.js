const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const BusinessDevelopmentService = require("./BusinessDevelopmentService");

const BusinessDevelopmentServiceItem = sequelize.define(
  "BusinessDevelopmentServiceItem",
  {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment:
        "Icon name from lucide-react (e.g., 'target', 'book-open', 'users', 'line-chart', 'trending-up', 'handshake')",
    },
    capabilities: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: "Array of capability strings",
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "Order for display",
    },
  },
  {
    tableName: "business_development_service_items",
    timestamps: true,
  }
);

// Relationship: BusinessDevelopmentService → many ServiceItems
BusinessDevelopmentService.hasMany(BusinessDevelopmentServiceItem, {
  foreignKey: "businessDevServiceId",
  onDelete: "CASCADE",
});
BusinessDevelopmentServiceItem.belongsTo(BusinessDevelopmentService, {
  foreignKey: "businessDevServiceId",
});

module.exports = BusinessDevelopmentServiceItem;
