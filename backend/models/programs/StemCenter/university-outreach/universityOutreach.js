const { DataTypes } = require('sequelize');
const sequelize = require('../../../../config/db');

const UniversityOutreach = sequelize.define('UniversityOutreach', {
  // Hero Section
  badge: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  subtitle: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  hero_image: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },

  // Statistics
  students_count: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  programs_count: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  research_projects: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  partners: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'university_outreach',
  timestamps: true,
});

module.exports = UniversityOutreach;
