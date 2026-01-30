const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const ChatbotSession = require('./chatbotSession');

const ChatbotMessage = sequelize.define(
  'ChatbotMessage',
  {
    sessionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ChatbotSession,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    role: {
      type: DataTypes.ENUM('system', 'user', 'assistant'),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: 'chatbot_messages',
    timestamps: true,
    indexes: [
      {
        fields: ['sessionId'],
      },
      {
        fields: ['createdAt'],
      },
    ],
  }
);

ChatbotSession.hasMany(ChatbotMessage, {
  as: 'messages',
  foreignKey: 'sessionId',
  onDelete: 'CASCADE',
});

ChatbotMessage.belongsTo(ChatbotSession, {
  as: 'session',
  foreignKey: 'sessionId',
});

module.exports = ChatbotMessage;

