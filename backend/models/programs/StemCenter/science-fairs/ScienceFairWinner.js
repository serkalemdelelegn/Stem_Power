const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const ScienceFairWinner = sequelize.define(
  "ScienceFairWinner",
  {
    projectTitle: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    studentName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    university: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    placementBadge: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: "science_fair_winners",
    timestamps: true,
  }
);

module.exports = ScienceFairWinner;