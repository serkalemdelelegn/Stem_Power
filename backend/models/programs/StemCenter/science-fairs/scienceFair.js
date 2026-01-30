const { DataTypes } = require('sequelize');
const sequelize = require('../../../../config/db');

const ScienceFair = sequelize.define('ScienceFair', {
  //  Hero Section
  badge: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  subtitle: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  hero_image: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },

  //  Statistics (stored as strings to allow symbols like "100+")
  projects_count: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  participants_count: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  schools_involved: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  awards_given: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },

}, {
  tableName: 'science_fairs',
  timestamps: true,
});

module.exports = ScienceFair;
