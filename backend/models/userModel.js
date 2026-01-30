const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: {
        args: [8, 100], // min 8, max 100 characters
        msg: 'Password must be at least 8 characters long',
      },
      isStrong(value) {
        // Must contain at least 1 uppercase, 1 lowercase, 1 number
        const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
        if (!strongPassword.test(value)) {
          throw new Error(
            'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number'
          );
        }
      },
    },
  },
  role: {
    type: DataTypes.ENUM('admin', 'editor', 'contributor', 'user'),
    defaultValue: 'user',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  permissions: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null,
    comment: 'JSON object storing page-specific permissions. null or empty means full access for admin role.',
  },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
