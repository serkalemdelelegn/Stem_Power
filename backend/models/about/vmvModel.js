const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const VMV = sequelize.define(
  "VMV",
  {
    type: {
      type: DataTypes.ENUM(
        "vision",
        "mission",
        "value",
        "hero",
        "whoWeAre",
        "ecosystem"
      ),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    // Hero section fields
    badge: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Badge text for hero section",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Description text for hero or whoWeAre section",
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Image URL for hero or whoWeAre section",
    },
    statistic: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Statistic value (e.g., '61' for STEM Centers)",
    },
    // Who We Are section fields
    whoWeAreBadge: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Badge for Who We Are section",
    },
    whoWeAreTitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Title for Who We Are section",
    },
    whoWeAreDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Description for Who We Are section",
    },
    whoWeAreImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Image URL for Who We Are section",
    },
    // Values (stored as JSON string)
    values: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "JSON string array of values with title and description",
    },
    // Testimonials (stored as JSON string)
    testimonials: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "JSON string array of testimonials",
    },
    // Ecosystem data (stored as JSON string)
    ecosystem: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "JSON string array of ecosystem steps",
    },
  },
  {
    tableName: "vision_mission_values",
    timestamps: true,
  }
);

module.exports = VMV;
