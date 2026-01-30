const NewsComment = require("../../models/latest/commentModel");
const News = require("../../models/latest/newsModel");
const User = require("../../models/userModel");

//  Add a new comment to a news post
exports.addComment = async (req, res) => {
  try {
    const { newsId, comment } = req.body;
    const userId = req.user.id; // assuming authentication middleware sets req.user

    // Check if the news exists
    const news = await News.findByPk(newsId);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    const newComment = await NewsComment.create({
      userId,
      newsId,
      comment,
    });

    res.status(201).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all comments for a specific news
exports.getCommentsByNews = async (req, res) => {
  try {
    const { newsId } = req.params;

    const comments = await NewsComment.findAll({
      where: { newsId },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"], // Include user info
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  Update a comment (only by owner)
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params; // comment ID
    const { comment } = req.body;
    const userId = req.user.id;

    const existingComment = await NewsComment.findByPk(id);

    if (!existingComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (existingComment.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized to update this comment" });
    }

    existingComment.comment = comment;
    await existingComment.save();

    res.status(200).json({ message: "Comment updated successfully", comment: existingComment });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a comment (only by owner)
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingComment = await NewsComment.findByPk(id);

    if (!existingComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (existingComment.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    await existingComment.destroy();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
