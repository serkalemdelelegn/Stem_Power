const express = require("express");
const router = express.Router();
const chatbotController = require("../../controllers/chatbotController");
const { authenticate } = require("../../middlewares/authMiddleware");

// Allow public session creation (no authentication required)
router.post("/sessions", chatbotController.createSession);
router.get("/sessions", chatbotController.getSessions);
router.get("/sessions/:sessionId", chatbotController.getSessionById);
router.delete(
  "/sessions/:sessionId",
  authenticate,
  chatbotController.deleteSession
);
router.get("/sessions/:sessionId/messages", chatbotController.getMessages);
router.post("/sessions/:sessionId/messages", chatbotController.sendMessage);

module.exports = router;
