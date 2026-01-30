const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const MakerSpace = require("./MakerSpace");

const MakerSpaceStat = sequelize.define(
  "MakerSpaceStat",
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
    tableName: "maker_space_stats",
    timestamps: true,
  }
);

// Relationships
MakerSpace.hasMany(MakerSpaceStat, {
  foreignKey: "makerSpaceId",
  onDelete: "CASCADE",
});
MakerSpaceStat.belongsTo(MakerSpace, {
  foreignKey: "makerSpaceId",
});

module.exports = MakerSpaceStat;
