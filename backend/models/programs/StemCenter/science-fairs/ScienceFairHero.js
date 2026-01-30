const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const ScienceFairHero = sequelize.define(
  "ScienceFairHero",
  {
    badge: {
      type: DataTypes.STRING(150),
      allowNull: false,
      defaultValue: "STEM Operations",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Innovation Meets Opportunity",
    },
    subtitle: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue:
        "Across Ethiopia, locally run Science and Engineering Fairs are sparking creativity and innovation among students. From grassroots communities to the national stage, young minds are designing solutions that shape the future.",
    },
  },
  {
    tableName: "science_fair_heroes",
    timestamps: true,
  }
);

module.exports = ScienceFairHero;
