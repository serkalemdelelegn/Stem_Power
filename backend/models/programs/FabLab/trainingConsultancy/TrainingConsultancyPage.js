const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const TrainingConsultancy = require("./TrainingConsultancy");

const TrainingConsultancyPage = sequelize.define(
  "TrainingConsultancyPage",
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: { isUrl: true },
    },
    meta_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hero_title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    hero_subtitle: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hero_image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: "training_consultancy_pages",
    timestamps: true,
  }
);

// Relationship: one TrainingConsultancy → many Pages
TrainingConsultancy.hasMany(TrainingConsultancyPage, {
  foreignKey: "trainingConsultancyId",
  onDelete: "CASCADE",
});
TrainingConsultancyPage.belongsTo(TrainingConsultancy, {
  foreignKey: "trainingConsultancyId",
});

module.exports = TrainingConsultancyPage;
