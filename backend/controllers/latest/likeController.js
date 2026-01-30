const NewsLike = require("../../models/latest/likeModel");
const News = require("../../models/latest/newsModel");

exports.toggleLike = async (req, res) => {
  try {
    const { newsId, userId } = req.body;

    if (!newsId || !userId) {
      return res.status(400).json({ message: "newsId and userId are required" });
    }

    // Check if the like already exists
    const existingLike = await NewsLike.findOne({ where: { newsId, userId } });

    if (existingLike) {
      // Unlike (delete record)
      await existingLike.destroy();

      // Decrease likeCount safely
      await News.increment({ likeCount: -1 }, { where: { id: newsId } });

      return res.status(200).json({ message: "News unliked successfully" });
    } else {
      // Like (create new record)
      await NewsLike.create({ newsId, userId });

      // Increase likeCount
      await News.increment({ likeCount: 1 }, { where: { id: newsId } });

      return res.status(201).json({ message: "News liked successfully" });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Error toggling like", error: error.message });
  }
};

// Get total likes for a specific news
exports.getLikesCount = async (req, res) => {
  try {
    const { newsId } = req.params;

    const count = await NewsLike.count({ where: { newsId } });

    res.status(200).json({ newsId, likeCount: count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching like count", error: error.message });
  }
};
