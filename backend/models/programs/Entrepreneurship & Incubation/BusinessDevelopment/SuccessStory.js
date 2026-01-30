const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const BusinessDevelopmentService = require("./BusinessDevelopmentService");

const SuccessStory = sequelize.define(
  "SuccessStory",
  {
    business_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    license_status: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    category_color: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    contact_person: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: { isEmail: true },
    },
    icon: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: "success_stories",
    timestamps: true,
  }
);

// Relationship
BusinessDevelopmentService.hasMany(SuccessStory, {
  foreignKey: "businessDevServiceId",
  onDelete: "CASCADE",
});
SuccessStory.belongsTo(BusinessDevelopmentService, {
  foreignKey: "businessDevServiceId",
});

module.exports = SuccessStory;
