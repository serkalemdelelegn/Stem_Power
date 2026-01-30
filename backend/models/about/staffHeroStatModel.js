const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const StaffHero = require("./staffHeroModel");

const StaffHeroStat = sequelize.define(
  "StaffHeroStat",
  {
    label: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "users",
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    tableName: "staff_hero_stats",
    timestamps: true,
  }
);

// Relations
StaffHero.hasMany(StaffHeroStat, {
  foreignKey: "staff_hero_id",
  onDelete: "CASCADE",
});
StaffHeroStat.belongsTo(StaffHero, {
  foreignKey: "staff_hero_id",
});

module.exports = StaffHeroStat;
