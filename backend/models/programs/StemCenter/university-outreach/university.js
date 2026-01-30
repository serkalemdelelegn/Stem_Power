const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");
const UniversityOutreach = require("./universityOutreach");

const University = sequelize.define(
  "University",
  {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    established: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    studentsServed: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    programStartYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Keep old fields for backward compatibility
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    university_details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    key_facilities: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notable_achievements: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    university_image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: { isUrl: true },
    },
    facilities: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    achievements: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    university_outreach_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "university_outreach",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "universities",
    timestamps: true,
  }
);

// Define association
University.belongsTo(UniversityOutreach, {
  foreignKey: "university_outreach_id",
  as: "outreach",
});
UniversityOutreach.hasMany(University, {
  foreignKey: "university_outreach_id",
  as: "universities",
});

module.exports = University;
