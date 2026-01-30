const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DynamicPage = sequelize.define(
  "DynamicPage",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    program: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    heroImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    heroTitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    heroSubtitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    heroDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ctaText: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ctaLink: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    sections: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    status: {
      type: DataTypes.ENUM("draft", "published"),
      defaultValue: "draft",
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "dynamic_pages",
    timestamps: true,
  }
);

module.exports = DynamicPage;
