const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const DigitalSkillHero = sequelize.define(
  "DigitalSkillHero",
  {
    badge: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "Entrepreneurship & Incubation",
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
        "Master in-demand digital skills through our transformative partnership with IBM SkillsBuild. Gain hands-on experience in coding, data analysis, robotics, and digital design — empowering you to innovate, solve real-world challenges, and shape the future of technology with confidence",
    },
  },
  {
    tableName: "digital_skill_heroes",
    timestamps: true,
  }
);

module.exports = DigitalSkillHero;
