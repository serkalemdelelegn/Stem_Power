const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const TrainingConsultancy = require("./TrainingConsultancy");

const SuccessMetric = sequelize.define(
  "SuccessMetric",
  {
    metric: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "The metric value (e.g., '95%', '80%', '50+')",
    },
    label: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "The metric label (e.g., 'Teacher Confidence Increase')",
    },
    icon: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "trendingup",
      comment:
        "Icon name from lucide-react (e.g., 'trendingup', 'lightbulb', 'wrench', 'bookopen')",
    },
  },
  {
    tableName: "success_metrics",
    timestamps: true,
  }
);

// Relationships
TrainingConsultancy.hasMany(SuccessMetric, {
  foreignKey: "trainingConsultancyId",
  onDelete: "CASCADE",
});
SuccessMetric.belongsTo(TrainingConsultancy, {
  foreignKey: "trainingConsultancyId",
});

module.exports = SuccessMetric;
