const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Announcement = sequelize.define(
  "Announcement",
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    media_url: {
      type: DataTypes.STRING(500),
      allowNull: true, // optional image/video link
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false, // when announcement goes live
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true, // optional expiry date
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    priority: {
      type: DataTypes.ENUM("low", "medium", "high"),
      defaultValue: "medium",
    },
    // Additional fields for frontend
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment:
        "Announcement category (e.g., 'Program Update', 'Job Opening', 'Event Announcement')",
    },
    type: {
      type: DataTypes.ENUM("update", "opportunity", "event"),
      allowNull: true,
      defaultValue: "update",
      comment: "Type of announcement: update, opportunity, or event",
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Location for event announcements",
    },
    excerpt: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Short excerpt/summary of the announcement",
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Application or registration deadline",
    },
    link: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "External link related to the announcement",
    },
    googleFormUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Google Form URL for applications or registrations",
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Reference to related event ID",
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Whether this announcement is featured",
    },
  },
  {
    tableName: "announcements",
    timestamps: true,
  }
);

module.exports = Announcement;
