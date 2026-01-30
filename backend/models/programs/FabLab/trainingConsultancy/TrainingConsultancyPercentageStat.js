const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const TrainingConsultancy = require("./TrainingConsultancy");

const TrainingConsultancyPercentageStat = sequelize.define(
  "TrainingConsultancyPercentageStat",
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    percentage_value: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 0, max: 100 },
    },
  },
  {
    tableName: "training_consultancy_percentage_stats",
    timestamps: true,
  }
);

// Relationship
TrainingConsultancy.hasMany(TrainingConsultancyPercentageStat, {
  foreignKey: "trainingConsultancyId",
  onDelete: "CASCADE",
});
TrainingConsultancyPercentageStat.belongsTo(TrainingConsultancy, {
  foreignKey: "trainingConsultancyId",
});

module.exports = TrainingConsultancyPercentageStat;
