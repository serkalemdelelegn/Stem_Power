const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const SoftSkillHero = sequelize.define(
  "SoftSkillHero",
  {
    badge: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "Entrepreneurship & Incubation",
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
        "Develop essential interpersonal and professional skills through comprehensive training in communication, teamwork, leadership, and problem-solving. Build the confidence, adaptability, and emotional intelligence needed to collaborate effectively, lead with purpose, and excel in both academic and professional environments.",
    },
  },
  {
    tableName: "soft_skill_heroes",
    timestamps: true,
  }
);

module.exports = SoftSkillHero;
