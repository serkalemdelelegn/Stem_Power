const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const MakerSpace = sequelize.define(
  "MakerSpace",
  {
    badge: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "FabLab Program",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Maker Space: Dream. Build. Discover.",
    },
    subtitle: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue:
        "Empowering innovators to bring their ideas to life through hands-on creation.",
    },
    hero_image: {
      type: DataTypes.STRING(500),
      allowNull: true, // URL or path for hero banner image
    },
  },
  {
    tableName: "maker_spaces",
    timestamps: true,
  }
);

module.exports = MakerSpace;
