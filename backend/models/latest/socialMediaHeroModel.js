const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const SocialMediaHero = sequelize.define(
  "SocialMediaHero",
  {
    badge: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Social Media Updates",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Follow Our Journey on Social Media",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue:
        "Stay connected with our daily updates, inspiring stories, and behind-the-scenes moments from the STEMpower Ethiopia community across all social platforms.",
    },
    stat1Value: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "25K+",
      comment: "First statistic value (e.g., '25K+')",
    },
    stat1Label: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "Total Followers",
      comment: "First statistic label",
    },
    stat2Value: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "150K+",
      comment: "Second statistic value (e.g., '150K+')",
    },
    stat2Label: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "Monthly Reach",
      comment: "Second statistic label",
    },
    stat3Value: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "8.5%",
      comment: "Third statistic value (e.g., '8.5%')",
    },
    stat3Label: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "Engagement Rate",
      comment: "Third statistic label",
    },
  },
  {
    tableName: "social_media_heroes",
    timestamps: true,
  }
);

module.exports = SocialMediaHero;
