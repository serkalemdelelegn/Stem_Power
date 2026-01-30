const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const ChatbotSession = sequelize.define(
  'ChatbotSession',
  {
    title: {
      type: DataTypes.STRING(180),
      allowNull: false,
      defaultValue: 'New conversation',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    lastInteractionAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'chatbot_sessions',
    timestamps: true,
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['lastInteractionAt'],
      },
    ],
  }
);

module.exports = ChatbotSession;

