const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const TrainingConsultancy = require("./TrainingConsultancy");

const TrainingProgram = sequelize.define(
  "TrainingProgram",
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "graduationcap",
      comment:
        "Icon name from lucide-react (e.g., 'graduationcap', 'users', 'building2')",
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    features: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: "Array of feature strings",
    },
    outcomes: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: "Array of outcome strings",
    },
  },
  {
    tableName: "training_programs",
    timestamps: true,
  }
);

// Relationships
TrainingConsultancy.hasMany(TrainingProgram, {
  foreignKey: "trainingConsultancyId",
  onDelete: "CASCADE",
});
TrainingProgram.belongsTo(TrainingConsultancy, {
  foreignKey: "trainingConsultancyId",
});

module.exports = TrainingProgram;
