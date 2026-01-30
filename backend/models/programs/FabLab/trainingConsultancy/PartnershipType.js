const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const TrainingConsultancy = require("./TrainingConsultancy");

const PartnershipType = sequelize.define(
  "PartnershipType",
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
      defaultValue: "school",
      comment:
        "Icon name from lucide-react (e.g., 'school', 'building2', 'factory')",
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "URL or path to partnership type image",
    },
    benefits: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: "Array of benefit strings",
    },
  },
  {
    tableName: "partnership_types",
    timestamps: true,
  }
);

// Relationships
TrainingConsultancy.hasMany(PartnershipType, {
  foreignKey: "trainingConsultancyId",
  onDelete: "CASCADE",
});
PartnershipType.belongsTo(TrainingConsultancy, {
  foreignKey: "trainingConsultancyId",
});

module.exports = PartnershipType;
