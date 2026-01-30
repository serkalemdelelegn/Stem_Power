const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const DigitalSkillTraining = require("./DigitalSkillTraining");

const DigitalSkillProgram = sequelize.define(
  "DigitalSkillProgram",
  {
    program_title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
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
  },
  {
    tableName: "digital_skill_programs",
    timestamps: true,
  }
);

// Relationship
DigitalSkillTraining.hasMany(DigitalSkillProgram, {
  foreignKey: "digitalSkillTrainingId",
  onDelete: "CASCADE",
});
DigitalSkillProgram.belongsTo(DigitalSkillTraining, {
  foreignKey: "digitalSkillTrainingId",
});

module.exports = DigitalSkillProgram;
