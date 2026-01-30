const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const TrainingConsultancyPage = require("./TrainingConsultancyPage");

const TrainingConsultancyPageStat = sequelize.define(
  "TrainingConsultancyPageStat",
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
    tableName: "training_consultancy_page_stats",
    timestamps: true,
  }
);

// Relationship: one Page → many Stats
TrainingConsultancyPage.hasMany(TrainingConsultancyPageStat, {
  foreignKey: "pageId",
  onDelete: "CASCADE",
});
TrainingConsultancyPageStat.belongsTo(TrainingConsultancyPage, {
  foreignKey: "pageId",
});

module.exports = TrainingConsultancyPageStat;
