const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const UniversityOutreach = require("./universityOutreach");

const UniversityOutreachImpactStat = sequelize.define(
  "UniversityOutreachImpactStat",
  {
    number: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "university_outreach_impact_stats",
    timestamps: true,
  }
);

// Relations
UniversityOutreach.hasMany(UniversityOutreachImpactStat, {
  foreignKey: "university_outreach_id",
  onDelete: "CASCADE",
});
UniversityOutreachImpactStat.belongsTo(UniversityOutreach, {
  foreignKey: "university_outreach_id",
});

module.exports = UniversityOutreachImpactStat;
