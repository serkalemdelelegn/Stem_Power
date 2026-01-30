const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const AnnouncementsHero = sequelize.define(
  "AnnouncementsHero",
  {
    badge: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Stay Informed",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Announcements & Opportunities",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue:
        "Stay up to date with official updates, exciting opportunities, and upcoming events from STEMpower Ethiopia. Be the first to know about new programs, job openings, and partnership announcements.",
    },
    activeAnnouncements: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "25+",
      comment: "Number of active announcements (e.g., '25+')",
    },
    openOpportunities: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "10+",
      comment: "Number of open opportunities (e.g., '10+')",
    },
    upcomingEvents: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "5+",
      comment: "Number of upcoming events (e.g., '5+')",
    },
  },
  {
    tableName: "announcements_heroes",
    timestamps: true,
  }
);

module.exports = AnnouncementsHero;
