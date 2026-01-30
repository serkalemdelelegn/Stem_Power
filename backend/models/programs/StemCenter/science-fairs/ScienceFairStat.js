const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const ScienceFairStat = sequelize.define(
  "ScienceFairStat",
  {
    number: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: "science_fair_stats",
    timestamps: true,
  }
);

module.exports = ScienceFairStat;
