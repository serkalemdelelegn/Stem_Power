const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const DigitalSkillTraining = require("./DigitalSkillTraining");

const DigitalSkillStat = sequelize.define(
  "DigitalSkillStat",
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
    tableName: "digital_skill_stats",
    timestamps: true,
  }
);

// Relationship
DigitalSkillTraining.hasMany(DigitalSkillStat, {
  foreignKey: "digitalSkillTrainingId",
  onDelete: "CASCADE",
});
DigitalSkillStat.belongsTo(DigitalSkillTraining, {
  foreignKey: "digitalSkillTrainingId",
});

module.exports = DigitalSkillStat;
