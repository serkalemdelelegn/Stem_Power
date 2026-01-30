const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const StemCenterHero = require("./StemCenterHero");

const StemCenterStat = sequelize.define(
  "StemCenterStat",
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
    tableName: "stem_center_stats",
    timestamps: true,
  }
);

// Relations
StemCenterHero.hasMany(StemCenterStat, {
  foreignKey: "heroId",
  onDelete: "CASCADE",
});
StemCenterStat.belongsTo(StemCenterHero, {
  foreignKey: "heroId",
});

module.exports = StemCenterStat;
