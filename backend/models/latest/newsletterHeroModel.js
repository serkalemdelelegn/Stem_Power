const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const NewsletterHero = sequelize.define(
  "NewsletterHero",
  {
    badge: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "STEMpower Newsletters",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Stay Connected",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue:
        "Explore our latest stories, achievements, and updates from the STEMpower Ethiopia community. Get insights into how we're transforming STEM education across the nation through innovation, collaboration, and dedication.",
    },
    subscribers: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "5,000+",
      comment: "Number of subscribers (e.g., '5,000+')",
    },
    newsletters: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "48+",
      comment: "Number of newsletters (e.g., '48+')",
    },
    monthlyReaders: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "12,000+",
      comment: "Monthly readers (e.g., '12,000+')",
    },
  },
  {
    tableName: "newsletter_heroes",
    timestamps: true,
  }
);

module.exports = NewsletterHero;
