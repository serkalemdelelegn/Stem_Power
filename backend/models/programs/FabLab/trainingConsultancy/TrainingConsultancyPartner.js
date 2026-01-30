const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const TrainingConsultancy = require("./TrainingConsultancy");

const TrainingConsultancyPartner = sequelize.define(
  "TrainingConsultancyPartner",
  {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    logo: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "URL or path to partner logo image",
    },
  },
  {
    tableName: "training_consultancy_partners",
    timestamps: true,
  }
);

// Relationships
TrainingConsultancy.hasMany(TrainingConsultancyPartner, {
  foreignKey: "trainingConsultancyId",
  onDelete: "CASCADE",
});
TrainingConsultancyPartner.belongsTo(TrainingConsultancy, {
  foreignKey: "trainingConsultancyId",
});

module.exports = TrainingConsultancyPartner;
