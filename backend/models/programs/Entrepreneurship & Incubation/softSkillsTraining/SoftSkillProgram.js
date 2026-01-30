const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const SoftSkillTraining = require("./SoftSkillTraining");

const SoftSkillProgram = sequelize.define(
  "SoftSkillProgram",
  {
    program_title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    about: {
      type: DataTypes.ENUM("open", "closed"),
      allowNull: false,
      defaultValue: "open",
    },
    status: {
      type: DataTypes.ENUM("free", "paid"),
      allowNull: false,
      defaultValue: "free",
    },
    duration: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: { isEmail: true },
    },
    google_form_link: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: { isUrl: true },
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: "soft_skill_programs",
    timestamps: true,
  }
);

// Relationship
SoftSkillTraining.hasMany(SoftSkillProgram, {
  foreignKey: "softSkillTrainingId",
  onDelete: "CASCADE",
});
SoftSkillProgram.belongsTo(SoftSkillTraining, {
  foreignKey: "softSkillTrainingId",
});

module.exports = SoftSkillProgram;
