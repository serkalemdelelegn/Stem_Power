const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const SoftSkillTraining = require("./SoftSkillTraining");

const SoftSkillStat = sequelize.define(
  "SoftSkillStat",
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "soft_skill_stats",
    timestamps: true,
  }
);

// Relationship
SoftSkillTraining.hasMany(SoftSkillStat, {
  foreignKey: "softSkillTrainingId",
  onDelete: "CASCADE",
});
SoftSkillStat.belongsTo(SoftSkillTraining, {
  foreignKey: "softSkillTrainingId",
});

module.exports = SoftSkillStat;
