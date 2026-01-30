const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const IncubationProgram = sequelize.define(
  "IncubationProgram",
  {
    badge: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "Incubation Program",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Incubation Program",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue:
        "Providing tailored support and mentorship to help startups grow from idea to impact.",
    },
  },
  {
    tableName: "incubation_programs",
    timestamps: true,
  }
);

module.exports = IncubationProgram;
