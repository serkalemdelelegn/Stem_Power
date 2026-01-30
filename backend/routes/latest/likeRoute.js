const express = require("express");
const router = express.Router();
const newsLikeController = require("../../controllers/latest/likeController");
const { authenticate } = require("../../middlewares/authMiddleware");

// Like or unlike news (toggle)
router.post("/toggle", authenticate, newsLikeController.toggleLike);

// Get like count for a news
router.get("/:newsId/count", newsLikeController.getLikesCount);

module.exports = router;
