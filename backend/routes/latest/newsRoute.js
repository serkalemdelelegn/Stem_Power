const express = require("express");
const router = express.Router();
const newsController = require("../../controllers/latest/newsController");
const { authenticate } = require("../../middlewares/authMiddleware");
const { checkPagePermission } = require("../../middlewares/permissionMiddleware");
const { singleUpload } = require("../../middlewares/upload");

// ===== Newsletter Hero =====
router.post(
  "/newsletter/hero",
  authenticate,
  checkPagePermission("latest"),
  newsController.createNewsletterHero
);
router.get("/newsletter/hero", newsController.getNewsletterHeroes);
router.get("/newsletter/hero/:id", newsController.getNewsletterHeroById);
router.put(
  "/newsletter/hero/:id",
  authenticate,
  checkPagePermission("latest"),
  newsController.updateNewsletterHero
);
router.delete(
  "/newsletter/hero/:id",
  authenticate,
  checkPagePermission("latest"),
  newsController.deleteNewsletterHero
);

// ===== Newsletters (filtered by source) =====
router.get("/newsletter", newsController.getNewsletters);
router.get("/newsletter/slug/:slug", newsController.getNewsletterBySlug);
router.put(
  "/newsletter/:id",
  authenticate,
  checkPagePermission("latest"),
  (req, _res, next) => {
    if (!req.body) req.body = {};
    // Force newsletter source and upload folder
    if (!req.body.source) {
      req.body.source = "newsletter";
    }
    req.uploadFolder = "newsletters";
    next();
  },
  singleUpload("file"),
  newsController.updateNews
);
router.delete("/newsletter/:id", authenticate, checkPagePermission("latest"), newsController.deleteNews);

// ===== Social Media Hero =====
router.post(
  "/social-media/hero",
  authenticate,
  checkPagePermission("latest"),
  newsController.createSocialMediaHero
);
router.get("/social-media/hero", newsController.getSocialMediaHeroes);
router.get("/social-media/hero/:id", newsController.getSocialMediaHeroById);
router.put(
  "/social-media/hero/:id",
  authenticate,
  checkPagePermission("latest"),
  newsController.updateSocialMediaHero
);
router.delete(
  "/social-media/hero/:id",
  authenticate,
  checkPagePermission("latest"),
  newsController.deleteSocialMediaHero
);

// ===== Social Media Posts (filtered by source) =====
router.get("/social-media", newsController.getSocialMediaPosts);
router.post(
  "/social-media",
  authenticate,
  checkPagePermission("latest"),
  (req, _res, next) => {
    if (!req.body) req.body = {};
    req.body.source = "social";
    req.uploadFolder = "social_media";
    next();
  },
  singleUpload("file"),
  newsController.createNews
);
router.put(
  "/social-media/:id",
  authenticate,
  checkPagePermission("latest"),
  (req, _res, next) => {
    if (!req.body) req.body = {};
    req.body.source = "social";
    req.uploadFolder = "social_media";
    next();
  },
  singleUpload("file"),
  newsController.updateNews
);
router.delete("/social-media/:id", authenticate, checkPagePermission("latest"), newsController.deleteNews);

// ===== Press Articles (filtered by source) =====
router.get("/press", newsController.getPressArticles);
router.post(
  "/press",
  authenticate,
  checkPagePermission("latest"),
  (req, _res, next) => {
    if (!req.body) req.body = {};
    req.body.source = "press";
    req.uploadFolder = "press_articles";
    next();
  },
  singleUpload("file"),
  newsController.createNews
);
router.put(
  "/press/:id",
  authenticate,
  checkPagePermission("latest"),
  (req, _res, next) => {
    if (!req.body) req.body = {};
    req.body.source = "press";
    req.uploadFolder = "press_articles";
    next();
  },
  singleUpload("file"),
  newsController.updateNews
);
router.delete("/press/:id", authenticate, checkPagePermission("latest"), newsController.deleteNews);

// ===== News CRUD =====
router.post(
  "/",
  authenticate,
  checkPagePermission("latest"),
  (req, res, next) => {
    if (!req.body) req.body = {};
    // Set upload folder based on source if provided, otherwise default to "news"
    const source = req.body.source || "news";
    if (source === "newsletter") {
      req.uploadFolder = "newsletters";
    } else if (source === "press") {
      req.uploadFolder = "press_articles";
    } else if (source === "social") {
      req.uploadFolder = "social_media";
    } else {
      req.uploadFolder = "news";
    }
    next();
  },
  singleUpload("file"),
  newsController.createNews
);
router.get("/", newsController.getAllNews);

// Refresh counts (optional route)
router.post("/:id/refresh-counts", authenticate, checkPagePermission("latest"), newsController.refreshCounts);

// ===== News by ID (must be last) =====
router.get("/:id", newsController.getNewsById);
router.put(
  "/:id",
  authenticate,
  checkPagePermission("latest"),
  (req, res, next) => {
    if (!req.body) req.body = {};
    // Set upload folder based on source if provided, otherwise default to "news"
    // For updates, we need to check the existing record's source or the body's source
    const source = req.body.source || "news";
    if (source === "newsletter") {
      req.uploadFolder = "newsletters";
    } else if (source === "press") {
      req.uploadFolder = "press_articles";
    } else if (source === "social") {
      req.uploadFolder = "social_media";
    } else {
      req.uploadFolder = "news";
    }
    next();
  },
  singleUpload("file"),
  newsController.updateNews
);
router.delete("/:id", authenticate, checkPagePermission("latest"), newsController.deleteNews);

module.exports = router;
