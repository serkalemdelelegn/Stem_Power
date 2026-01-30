const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const MakerSpaceHero = sequelize.define(
  "MakerSpaceHero",
  {
    badge: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "FabLab Program",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Dream. Build. Discover.",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue:
        "A place where creativity comes alive. Explore ideas, experiment with new tools, and bring bold dreams to life—together.",
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: "maker_space_heroes",
    timestamps: true,
  }
);

module.exports = MakerSpaceHero;
