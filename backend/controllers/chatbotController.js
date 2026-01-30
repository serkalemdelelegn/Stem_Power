const { Op } = require("sequelize");
const ChatbotSession = require("../models/chatbot/chatbotSession");
const ChatbotMessage = require("../models/chatbot/chatbotMessage");
const { getChatbotReply } = require("../service/chatbot/chatbotService");

async function createSession(req, res) {
  try {
    const { title, userId, metadata } = req.body || {};

    const session = await ChatbotSession.create({
      title: title?.trim() || "New conversation",
      userId: userId ?? null,
      metadata: metadata || null,
    });

    return res.status(201).json(session);
  } catch (error) {
    console.error("Failed to create chatbot session:", error);
    return res
      .status(500)
      .json({ message: "Unable to create chatbot session." });
  }
}

async function getSessions(req, res) {
  try {
    const { userId } = req.query;
    const whereClause = {};

    if (userId) {
      whereClause.userId = userId;
    }

    const sessions = await ChatbotSession.findAll({
      where: whereClause,
      order: [
        ["lastInteractionAt", "DESC"],
        ["updatedAt", "DESC"],
      ],
      include: [
        {
          model: ChatbotMessage,
          as: "messages",
          separate: true,
          limit: 1,
          order: [["createdAt", "DESC"]],
        },
      ],
    });

    return res.json(sessions);
  } catch (error) {
    console.error("Failed to fetch chatbot sessions:", error);
    return res
      .status(500)
      .json({ message: "Unable to fetch chatbot sessions." });
  }
}

async function getSessionById(req, res) {
  try {
    const { sessionId } = req.params;
    const session = await ChatbotSession.findByPk(sessionId, {
      include: [
        {
          model: ChatbotMessage,
          as: "messages",
          order: [["createdAt", "ASC"]],
        },
      ],
    });

    if (!session) {
      return res.status(404).json({ message: "Chatbot session not found." });
    }

    return res.json(session);
  } catch (error) {
    console.error("Failed to fetch chatbot session:", error);
    return res
      .status(500)
      .json({ message: "Unable to fetch chatbot session." });
  }
}

async function deleteSession(req, res) {
  try {
    const { sessionId } = req.params;
    const deletedCount = await ChatbotSession.destroy({
      where: { id: sessionId },
    });

    if (!deletedCount) {
      return res.status(404).json({ message: "Chatbot session not found." });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Failed to delete chatbot session:", error);
    return res
      .status(500)
      .json({ message: "Unable to delete chatbot session." });
  }
}

async function getMessages(req, res) {
  try {
    const { sessionId } = req.params;
    const session = await ChatbotSession.findByPk(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Chatbot session not found." });
    }

    const messages = await ChatbotMessage.findAll({
      where: { sessionId },
      order: [["createdAt", "ASC"]],
    });

    return res.json({
      session,
      messages,
    });
  } catch (error) {
    console.error("Failed to fetch chatbot messages:", error);
    return res
      .status(500)
      .json({ message: "Unable to fetch chatbot messages." });
  }
}

async function sendMessage(req, res) {
  try {
    const { sessionId } = req.params;
    const { message, metadata, language } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message content is required." });
    }

    const session = await ChatbotSession.findByPk(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Chatbot session not found." });
    }

    const userMessage = await ChatbotMessage.create({
      sessionId,
      role: "user",
      content: message.trim(),
      metadata: metadata || null,
    });

    const recentContext = await ChatbotMessage.findAll({
      where: {
        sessionId,
        createdAt: {
          [Op.lte]: userMessage.createdAt,
        },
      },
      order: [["createdAt", "ASC"]],
    });

    const assistantReply = await getChatbotReply({
      message: userMessage.content,
      context: recentContext.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      language: language || "en", // Pass language preference to chatbot service
    });

    const assistantMessage = await ChatbotMessage.create({
      sessionId,
      role: "assistant",
      content: assistantReply,
    });

    await session.update({
      lastInteractionAt: new Date(),
    });

    return res.status(200).json({
      sessionId,
      messages: [userMessage, assistantMessage],
    });
  } catch (error) {
    console.error("Failed to process chatbot message:", error);
    return res.status(500).json({
      message: "Unable to process chatbot message.",
    });
  }
}

module.exports = {
  createSession,
  getSessions,
  getSessionById,
  deleteSession,
  getMessages,
  sendMessage,
};
