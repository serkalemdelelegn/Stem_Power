const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const MakerSpace = require("./MakerSpace");

const MakerSpaceFeature = sequelize.define(
  "MakerSpaceFeature",
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "sparkles",
      comment:
        "Icon name from lucide-react (e.g., 'printer', 'cpu', 'palette', 'users-round')",
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Optional category for grouping features",
    },
  },
  {
    tableName: "maker_space_features",
    timestamps: true,
  }
);

// Relationships
MakerSpace.hasMany(MakerSpaceFeature, {
  foreignKey: "makerSpaceId",
  onDelete: "CASCADE",
});
MakerSpaceFeature.belongsTo(MakerSpace, {
  foreignKey: "makerSpaceId",
});

module.exports = MakerSpaceFeature;
