const { Op } = require("sequelize");
const News = require("../../models/latest/newsModel");
const Comment = require("../../models/latest/commentModel");
const Like = require("../../models/latest/likeModel");
const NewsletterHero = require("../../models/latest/newsletterHeroModel");
const SocialMediaHero = require("../../models/latest/socialMediaHeroModel");

//  Create News
exports.createNews = async (req, res) => {
  try {
    const newsData = { ...req.body };

    // Handle image upload
    if (req.file) {
      newsData.image = req.file.path;
    } else if (req.body.image !== undefined) {
      newsData.image = req.body.image || null;
    }

    // Parse date strings
    if (newsData.date && typeof newsData.date === "string") {
      newsData.date = new Date(newsData.date);
    }

    // Parse boolean strings from FormData
    if (typeof newsData.featured === "string") {
      newsData.featured = newsData.featured === "true";
    }

    // Parse integer strings from FormData for social media engagement metrics
    if (typeof newsData.likeCount === "string") {
      newsData.likeCount = parseInt(newsData.likeCount, 10) || 0;
    }
    if (typeof newsData.commentCount === "string") {
      newsData.commentCount = parseInt(newsData.commentCount, 10) || 0;
    }
    if (typeof newsData.shares === "string") {
      newsData.shares = parseInt(newsData.shares, 10) || 0;
    }

    // Ensure source is set (default to "newsletter" if not provided, but preserve if already set)
    if (!newsData.source) {
      newsData.source = "newsletter";
    }

    // Generate slug if missing (only for newsletters)
    if (!newsData.slug && newsData.title && newsData.source === "newsletter") {
      const slugify = (text) => {
        return text
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      };
      newsData.slug = slugify(newsData.title);
    }

    if (!newsData.title || !newsData.content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const news = await News.create(newsData);
    res.status(201).json({ message: "News created successfully", news });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating news", error: error.message });
  }
};

//  Get All News
exports.getAllNews = async (req, res) => {
  try {
    const newsList = await News.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(newsList);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching news", error: error.message });
  }
};

//  Get Single News (with dynamic views)
exports.getNewsById = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findByPk(id);
    if (!news) return res.status(404).json({ message: "News not found" });

    // increment view count for each unique view (simplified — normally you'd track by user/IP)
    await news.increment("views", { by: 1 });

    // Fetch latest counts for comments and likes
    const commentCount = await Comment.count({ where: { newsId: id } });
    const likeCount = await Like.count({ where: { newsId: id } });

    // Update counts dynamically in the News table
    news.commentCount = commentCount;
    news.likeCount = likeCount;
    await news.save();

    res.status(200).json(news);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching news details", error: error.message });
  }
};

//  Update News
exports.updateNews = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;

    const news = await News.findByPk(id);
    if (!news) return res.status(404).json({ message: "News not found" });

    const updatedData = { ...req.body };

    // Handle image upload
    if (req.file) {
      updatedData.image = req.file.path;
    } else if (req.body.image !== undefined) {
      updatedData.image = req.body.image || null;
    }

    // Parse date strings
    if (updatedData.date && typeof updatedData.date === "string") {
      updatedData.date = new Date(updatedData.date);
    }

    // Parse boolean strings from FormData
    if (typeof updatedData.featured === "string") {
      updatedData.featured = updatedData.featured === "true";
    }

    // Parse integer strings from FormData for social media engagement metrics
    if (typeof updatedData.likeCount === "string") {
      updatedData.likeCount = parseInt(updatedData.likeCount, 10) || 0;
    }
    if (typeof updatedData.commentCount === "string") {
      updatedData.commentCount = parseInt(updatedData.commentCount, 10) || 0;
    }
    if (typeof updatedData.shares === "string") {
      updatedData.shares = parseInt(updatedData.shares, 10) || 0;
    }

    // Generate slug if missing and title changed (only for newsletters)
    if (
      !updatedData.slug &&
      updatedData.title &&
      (updatedData.source === "newsletter" || news.source === "newsletter")
    ) {
      const slugify = (text) => {
        return text
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      };
      updatedData.slug = slugify(updatedData.title);
    }

    await news.update(updatedData);
    res.status(200).json({ message: "News updated successfully", news });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating news", error: error.message });
  }
};

//  Delete News
exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findByPk(id);
    if (!news) return res.status(404).json({ message: "News not found" });

    await news.destroy();
    res.status(200).json({ message: "News deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting news", error: error.message });
  }
};

//  Refresh Comment & Like Count
// This can be triggered when a comment or like is added/removed
exports.refreshCounts = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findByPk(id);
    if (!news) return res.status(404).json({ message: "News not found" });

    const commentCount = await Comment.count({ where: { newsId: id } });
    const likeCount = await Like.count({ where: { newsId: id } });

    await news.update({ commentCount, likeCount });

    res.status(200).json({ message: "Counts refreshed", news });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error refreshing counts", error: error.message });
  }
};

// ===== Newsletter Hero =====
exports.createNewsletterHero = async (req, res) => {
  try {
    const hero = await NewsletterHero.create(req.body);
    res.status(201).json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNewsletterHeroes = async (_req, res) => {
  try {
    const heroes = await NewsletterHero.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNewsletterHeroById = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const hero = await NewsletterHero.findByPk(id);

    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }

    res.json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateNewsletterHero = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const hero = await NewsletterHero.findByPk(id);

    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }

    await hero.update(req.body);
    res.json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteNewsletterHero = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const hero = await NewsletterHero.findByPk(id);

    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }

    await hero.destroy();
    res.json({ message: "Hero deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Get Newsletters (filter by source) =====
exports.getNewsletters = async (req, res) => {
  try {
    const newsletters = await News.findAll({
      where: { source: "newsletter" },
      order: [["createdAt", "DESC"]],
    });
    res.json(newsletters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Get Newsletter by Slug =====
exports.getNewsletterBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // First try to find by exact slug match
    let newsletter = await News.findOne({
      where: {
        slug: slug,
        source: "newsletter",
      },
    });

    // If not found, try to find by matching slugified title
    if (!newsletter) {
      const allNewsletters = await News.findAll({
        where: { source: "newsletter" },
      });

      // Helper function to slugify
      const slugify = (text) => {
        return text
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      };

      newsletter = allNewsletters.find((item) => {
        if (item.slug && item.slug === slug) return true;
        if (item.title && slugify(item.title) === slug) return true;
        if (item.id && String(item.id) === slug) return true;
        return false;
      });
    }

    if (!newsletter) {
      return res.status(404).json({ message: "Newsletter not found" });
    }

    // Increment view count
    await newsletter.increment("views", { by: 1 });

    // Fetch latest counts for comments and likes
    const commentCount = await Comment.count({
      where: { newsId: newsletter.id },
    });
    const likeCount = await Like.count({ where: { newsId: newsletter.id } });

    // Update counts dynamically
    newsletter.commentCount = commentCount;
    newsletter.likeCount = likeCount;
    await newsletter.save();

    res.status(200).json(newsletter);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching newsletter", error: error.message });
  }
};

// ===== Social Media Hero =====
exports.createSocialMediaHero = async (req, res) => {
  try {
    const hero = await SocialMediaHero.create(req.body);
    res.status(201).json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSocialMediaHeroes = async (_req, res) => {
  try {
    const heroes = await SocialMediaHero.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSocialMediaHeroById = async (req, res) => {
  try {
    const hero = await SocialMediaHero.findByPk(req.params.id);

    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }

    res.json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSocialMediaHero = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const hero = await SocialMediaHero.findByPk(id);

    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }

    await hero.update(req.body);
    res.json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSocialMediaHero = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const hero = await SocialMediaHero.findByPk(id);

    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }

    await hero.destroy();
    res.json({ message: "Hero deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Get Social Media Posts (filter by source) =====
exports.getSocialMediaPosts = async (req, res) => {
  try {
    const posts = await News.findAll({
      where: { source: "social" },
      order: [["createdAt", "DESC"]],
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Get Press Articles (filter by source) =====
exports.getPressArticles = async (req, res) => {
  try {
    const articles = await News.findAll({
      where: {
        source: {
          [Op.or]: ["press", null, ""],
        },
      },
      order: [["createdAt", "DESC"]],
    });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
