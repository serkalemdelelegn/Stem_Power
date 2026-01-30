const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const MakerSpace = require("./MakerSpace");

const MakerSpaceWorkshop = sequelize.define(
  "MakerSpaceWorkshop",
  {
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    level: {
      type: DataTypes.ENUM("beginner", "intermediate", "advanced"),
      allowNull: false,
      defaultValue: "beginner",
    },
    duration: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    registration_link: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: { isUrl: true },
    },
    workshop_image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: "maker_space_workshops",
    timestamps: true,
  }
);

// Relationships
MakerSpace.hasMany(MakerSpaceWorkshop, {
  foreignKey: "makerSpaceId",
  onDelete: "CASCADE",
});
MakerSpaceWorkshop.belongsTo(MakerSpace, {
  foreignKey: "makerSpaceId",
});

module.exports = MakerSpaceWorkshop;
