const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const MakerSpace = require("./MakerSpace");

const MakerSpaceGallery = sequelize.define(
  "MakerSpaceGallery",
  {
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: false, // URL or path to image
    },
    caption: {
      type: DataTypes.STRING(255),
      allowNull: true, // optional caption
    },
  },
  {
    tableName: "maker_space_gallery",
    timestamps: true,
  }
);

// Relationships
MakerSpace.hasMany(MakerSpaceGallery, {
  foreignKey: "makerSpaceId",
  onDelete: "CASCADE",
});
MakerSpaceGallery.belongsTo(MakerSpace, {
  foreignKey: "makerSpaceId",
});

module.exports = MakerSpaceGallery;
