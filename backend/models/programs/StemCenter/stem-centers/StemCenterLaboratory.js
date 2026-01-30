const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const StemCenter = require("./StemCenter");
const StemLaboratory = require("./StemLaboratory");

const StemCenterLaboratory = sequelize.define(
  "StemCenterLaboratory",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    tableName: "stem_center_laboratories",
    timestamps: true,
  }
);

// Relationships
StemCenter.belongsToMany(StemLaboratory, {
  through: StemCenterLaboratory,
  foreignKey: "centerId",
  onDelete: "CASCADE",
});
StemLaboratory.belongsToMany(StemCenter, {
  through: StemCenterLaboratory,
  foreignKey: "laboratoryId",
  onDelete: "CASCADE",
});

module.exports = StemCenterLaboratory;
