const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const ScienceFairJourneyStage = sequelize.define(
  "ScienceFairJourneyStage",
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    badge: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    tableName: "science_fair_journey_stages",
    timestamps: true,
  }
);

module.exports = ScienceFairJourneyStage;
