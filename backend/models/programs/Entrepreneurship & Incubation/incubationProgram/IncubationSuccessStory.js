const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const IncubationProgram = require("./IncubationProgram");

const IncubationSuccessStory = sequelize.define(
  "IncubationSuccessStory",
  {
    business_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    license_status: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    category_color: {
      type: DataTypes.STRING(50),
      allowNull: true, // for color coding
    },
    contact_person: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
      validate: { isEmail: true },
    },
    icon: {
      type: DataTypes.STRING(500),
      allowNull: true, // optional icon/image URL
    },
  },
  {
    tableName: "incubation_success_stories",
    timestamps: true,
  }
);

// Relationship
IncubationProgram.hasMany(IncubationSuccessStory, {
  foreignKey: "incubationProgramId",
  onDelete: "CASCADE",
});
IncubationSuccessStory.belongsTo(IncubationProgram, {
  foreignKey: "incubationProgramId",
});

module.exports = IncubationSuccessStory;
