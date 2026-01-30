const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Event = sequelize.define(
  "Event",
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_virtual: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Whether the event is online or physical
    },
    event_url: {
      type: DataTypes.STRING(500),
      allowNull: true, // Link for virtual events (Zoom/Google Meet/etc.)
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true, // URL or path for the event image
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    // Additional fields for frontend
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment:
        "Event category (e.g., 'Competition', 'Workshop', 'Summit', 'Bootcamp', 'Training', 'Showcase')",
    },
    badge: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Event badge or tag",
    },
    status: {
      type: DataTypes.ENUM("upcoming", "past"),
      allowNull: true,
      defaultValue: "upcoming",
      comment: "Event status: upcoming or past",
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Whether this event is featured",
    },
    time: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Event time (e.g., '10:00 AM - 4:00 PM')",
    },
    participants: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Number of participants (e.g., '100+', '50-100')",
    },
    registrationLink: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "URL to registration form",
    },
    registrationDeadline: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Registration deadline (e.g., 'March 15, 2024')",
    },
    fullDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Full detailed description of the event",
    },
    highlights: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Array of event highlights",
    },
  },
  {
    tableName: "events",
    timestamps: true,
  }
);

module.exports = Event;
