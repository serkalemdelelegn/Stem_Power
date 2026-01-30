const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const TrainingConsultancyHero = sequelize.define(
  "TrainingConsultancyHero",
  {
    badge: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Building Capacity, Transforming Education",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "STEM Training & Consultancy",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue:
        "Evidence-driven solutions that strengthen education systems and build local capacity. Partnering with schools, universities, private sectors, and governments to design and deliver customized STEM programs that create sustainable impact.",
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: "training_consultancy_heroes",
    timestamps: true,
  }
);

module.exports = TrainingConsultancyHero;
