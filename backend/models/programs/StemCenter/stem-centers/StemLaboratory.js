const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const StemLaboratory = sequelize.define(
  "StemLaboratory",
  {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: true,
      unique: true,
    },
    icon: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "🔬",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "stem_laboratories",
    timestamps: true,
  }
);

module.exports = StemLaboratory;
