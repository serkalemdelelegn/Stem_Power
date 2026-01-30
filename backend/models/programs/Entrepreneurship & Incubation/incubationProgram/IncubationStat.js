const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const IncubationProgram = require("./IncubationProgram");

const IncubationStat = sequelize.define(
  "IncubationStat",
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
    tableName: "incubation_stats",
    timestamps: true,
  }
);

// Relationship
IncubationProgram.hasMany(IncubationStat, {
  foreignKey: "incubationProgramId",
  onDelete: "CASCADE",
});
IncubationStat.belongsTo(IncubationProgram, {
  foreignKey: "incubationProgramId",
});

module.exports = IncubationStat;
