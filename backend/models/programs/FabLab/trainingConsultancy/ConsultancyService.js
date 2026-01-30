const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const TrainingConsultancy = require("./TrainingConsultancy");

const ConsultancyService = sequelize.define(
  "ConsultancyService",
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
      defaultValue: "bookopen",
      comment:
        "Icon name from lucide-react (e.g., 'bookopen', 'wrench', 'factory', 'target')",
    },
    deliverables: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: "Array of deliverable strings",
    },
  },
  {
    tableName: "consultancy_services",
    timestamps: true,
  }
);

// Relationships
TrainingConsultancy.hasMany(ConsultancyService, {
  foreignKey: "trainingConsultancyId",
  onDelete: "CASCADE",
});
ConsultancyService.belongsTo(TrainingConsultancy, {
  foreignKey: "trainingConsultancyId",
});

module.exports = ConsultancyService;
