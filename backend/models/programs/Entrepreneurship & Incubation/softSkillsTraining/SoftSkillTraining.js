const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const SoftSkillTraining = sequelize.define(
  "SoftSkillTraining",
  {
    badge: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "Soft Skills Training",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Soft Skills Training",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue:
        "Developing essential interpersonal and communication skills for career success.",
    },
  },
  {
    tableName: "soft_skill_trainings",
    timestamps: true,
  }
);

module.exports = SoftSkillTraining;
