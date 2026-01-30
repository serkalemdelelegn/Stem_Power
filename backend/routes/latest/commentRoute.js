const express = require("express");
const router = express.Router();
const newsCommentController = require("../../controllers/latest/commentController");
const { authenticate } = require("../../middlewares/authMiddleware"); // middleware to verify user

//  Add a new comment (only logged-in users)
router.post("/:newsId/comments", authenticate, newsCommentController.addComment);

//  Get all comments for a specific news
router.get("/:newsId/comments", newsCommentController.getCommentsByNews);

//  Update a comment (only by the user who posted it)
router.put("/comments/:id", authenticate, newsCommentController.updateComment);

//  Delete a comment (only by the user who posted it)
router.delete("/comments/:id", authenticate, newsCommentController.deleteComment);

module.exports = router;
