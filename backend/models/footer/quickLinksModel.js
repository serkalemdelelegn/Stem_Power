const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const QuickLink = sequelize.define('QuickLink', {
  title: {
    type: DataTypes.STRING(150),
    allowNull: false, // visible name
  },
  url: {
    type: DataTypes.STRING(500),
    allowNull: false, // link to page
    validate: { isUrl: true },
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true, // optional grouping
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // sorting order
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true, // enable/disable link
  }
}, {
  tableName: 'quick_links',
  timestamps: true,
});

module.exports = QuickLink;
