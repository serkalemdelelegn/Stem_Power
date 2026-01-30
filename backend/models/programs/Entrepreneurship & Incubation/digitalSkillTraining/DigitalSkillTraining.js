const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const DigitalSkillTraining = sequelize.define(
  "DigitalSkillTraining",
  {
    badge: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "Digital Skills",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Digital Skills Training",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue:
        "Empowering individuals with essential digital skills for the modern world.",
    },
  },
  {
    tableName: "digital_skill_trainings",
    timestamps: true,
  }
);

module.exports = DigitalSkillTraining;
