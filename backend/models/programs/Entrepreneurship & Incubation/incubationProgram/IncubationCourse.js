const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const IncubationProgram = require("./IncubationProgram");

const IncubationCourse = sequelize.define(
  "IncubationCourse",
  {
    program_title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    about: {
      type: DataTypes.ENUM("open", "closed"),
      allowNull: false,
      defaultValue: "open",
    },
    status: {
      type: DataTypes.ENUM("free", "paid"),
      allowNull: false,
      defaultValue: "free",
    },
    duration: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: { isEmail: true },
    },
    google_form_link: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: { isUrl: true },
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: "incubation_courses",
    timestamps: true,
  }
);

// Relationship
IncubationProgram.hasMany(IncubationCourse, {
  foreignKey: "incubationProgramId",
  onDelete: "CASCADE",
});
IncubationCourse.belongsTo(IncubationProgram, {
  foreignKey: "incubationProgramId",
});

module.exports = IncubationCourse;
