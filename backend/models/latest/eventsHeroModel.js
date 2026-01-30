const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const EventsHero = sequelize.define(
  "EventsHero",
  {
    badge: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "STEMpower Ethiopia Events",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Join Our STEM Community Events",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue:
        "Discover workshops, competitions, and networking opportunities designed to advance STEM education and innovation across Ethiopia.",
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Hero image URL or path",
    },
    stat1Icon: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "calendar",
      comment: "First statistic icon (e.g., 'calendar', 'users', 'star')",
    },
    stat1Value: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "50+",
      comment: "First statistic value (e.g., '50+')",
    },
    stat1Label: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "Annual Events",
      comment: "First statistic label",
    },
    stat2Icon: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "users",
      comment: "Second statistic icon",
    },
    stat2Value: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "10,000+",
      comment: "Second statistic value",
    },
    stat2Label: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "Participants",
      comment: "Second statistic label",
    },
    stat3Icon: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "star",
      comment: "Third statistic icon",
    },
    stat3Value: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "25+",
      comment: "Third statistic value",
    },
    stat3Label: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "Competitions Hosted",
      comment: "Third statistic label",
    },
  },
  {
    tableName: "events_heroes",
    timestamps: true,
  }
);

module.exports = EventsHero;
