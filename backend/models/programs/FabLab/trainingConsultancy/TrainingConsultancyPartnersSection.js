const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const TrainingConsultancyPartnersSection = sequelize.define(
  "TrainingConsultancyPartnersSection",
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Trusted by partners",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue:
        "We collaborate with education leaders and development partners nationwide.",
    },
  },
  {
    tableName: "training_consultancy_partners_sections",
    timestamps: true,
  }
);

module.exports = TrainingConsultancyPartnersSection;
