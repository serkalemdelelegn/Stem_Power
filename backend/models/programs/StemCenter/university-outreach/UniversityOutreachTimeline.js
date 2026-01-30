const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const UniversityOutreach = require("./universityOutreach");

const UniversityOutreachTimeline = sequelize.define(
  "UniversityOutreachTimeline",
  {
    phase: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    year: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    tableName: "university_outreach_timelines",
    timestamps: true,
  }
);

// Relations
UniversityOutreach.hasMany(UniversityOutreachTimeline, {
  foreignKey: "university_outreach_id",
  onDelete: "CASCADE",
});
UniversityOutreachTimeline.belongsTo(UniversityOutreach, {
  foreignKey: "university_outreach_id",
});

module.exports = UniversityOutreachTimeline;
