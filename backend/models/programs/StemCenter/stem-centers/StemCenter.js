const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const StemCenterHero = require("./StemCenterHero");

const StemCenter = sequelize.define(
  "StemCenter",
  {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    established_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    director_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    funded_by: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: { isUrl: true },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "stem_centers",
    timestamps: true,
  }
);

// Relation: Hero → many Centers
StemCenterHero.hasMany(StemCenter, {
  foreignKey: "heroId",
  onDelete: "CASCADE",
});
StemCenter.belongsTo(StemCenterHero, {
  foreignKey: "heroId",
});

module.exports = StemCenter;
