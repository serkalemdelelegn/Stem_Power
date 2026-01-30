const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const TrainingConsultancy = require("./TrainingConsultancy");

const TrainingConsultancyStat = sequelize.define(
  "TrainingConsultancyStat",
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment:
        "Icon name from lucide-react (e.g., 'building2', 'graduationcap', 'globe', 'award')",
    },
  },
  {
    tableName: "training_consultancy_stats",
    timestamps: true,
  }
);

// Relationship
TrainingConsultancy.hasMany(TrainingConsultancyStat, {
  foreignKey: "trainingConsultancyId",
  onDelete: "CASCADE",
});
TrainingConsultancyStat.belongsTo(TrainingConsultancy, {
  foreignKey: "trainingConsultancyId",
});

module.exports = TrainingConsultancyStat;
