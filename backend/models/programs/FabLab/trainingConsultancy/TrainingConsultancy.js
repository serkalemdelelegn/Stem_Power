const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const TrainingConsultancy = sequelize.define(
  "TrainingConsultancy",
  {
    badge: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "FabLab Program",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Training & Consultancy",
    },
    subtitle: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hero_image: {
      type: DataTypes.STRING(500),
      allowNull: true, // URL or file path for hero image
    },
    button_text: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    button_link: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: { isUrl: true },
    },
  },
  {
    tableName: "training_consultancy",
    timestamps: true,
  }
);

module.exports = TrainingConsultancy;
