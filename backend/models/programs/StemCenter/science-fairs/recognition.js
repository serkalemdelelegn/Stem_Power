const { DataTypes } = require('sequelize');
const sequelize = require('../../../../config/db');
const ScienceFair = require('./scienceFair');

const Recognition = sequelize.define('Recognition', {
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(100),
    allowNull: false, // e.g. "Excellence", "Giving Back"
  },
  level_of_recognition: {
    type: DataTypes.STRING(100),
    allowNull: false, // e.g. "National", "Regional", "International"
  },
  awarded_by: {
    type: DataTypes.STRING(255),
    allowNull: false, // who recognized or gave the award
  },
  prize_amount: {
    type: DataTypes.STRING(100),
    allowNull: true, // e.g. "50,000 Birr", "$1,000"
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  science_fair_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'science_fairs',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'recognitions',
  timestamps: true,
});

//  Define Relationships
Recognition.belongsTo(ScienceFair, {
  foreignKey: 'science_fair_id',
  as: 'science_fair',
});

ScienceFair.hasMany(Recognition, {
  foreignKey: 'science_fair_id',
  as: 'recognitions',
});

module.exports = Recognition;
