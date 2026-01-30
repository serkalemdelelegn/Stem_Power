const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const UniversityOutreach = require("./universityOutreach");

const UniversityOutreachProgramBenefit = sequelize.define(
  "UniversityOutreachProgramBenefit",
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    tableName: "university_outreach_program_benefits",
    timestamps: true,
  }
);

// Relations
UniversityOutreach.hasMany(UniversityOutreachProgramBenefit, {
  foreignKey: "university_outreach_id",
  onDelete: "CASCADE",
});
UniversityOutreachProgramBenefit.belongsTo(UniversityOutreach, {
  foreignKey: "university_outreach_id",
});

module.exports = UniversityOutreachProgramBenefit;
