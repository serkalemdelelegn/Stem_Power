const express = require("express");
const router = express.Router();
const businessDevelopmentController = require("../../../controllers/programs/Entrepreneurship/businessDevelopmentController");
const { singleUpload } = require("../../../middlewares/upload");
const { authenticate } = require("../../../middlewares/authMiddleware");

// ===== Hero (Business Development Service) =====
router.post(
  "/hero",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "business_development_hero"; // Cloudinary folder
    next();
  },
  singleUpload("file"), // frontend must send "file"
  businessDevelopmentController.createHero
);
router.get("/hero", businessDevelopmentController.getHero);
router.put(
  "/hero/:id",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "business_development_hero"; // Cloudinary folder
    next();
  },
  singleUpload("file"), // frontend must send "file"
  businessDevelopmentController.updateHero
);
router.delete(
  "/hero/:id",
  authenticate,
  businessDevelopmentController.deleteHero
);

// ===== Statistics =====
router.post(
  "/statistics",
  authenticate,
  businessDevelopmentController.createStatistic
);
router.get("/statistics", businessDevelopmentController.getStatistics);
router.put(
  "/statistics/:id",
  authenticate,
  businessDevelopmentController.updateStatistic
);
router.delete(
  "/statistics/:id",
  authenticate,
  businessDevelopmentController.deleteStatistic
);

// ===== Partners (Funding Partners) =====
router.post(
  "/partners",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "business_development_partners"; // Cloudinary folder
    next();
  },
  singleUpload("file"), // frontend must send "file"
  businessDevelopmentController.createPartner
);
router.get("/partners", businessDevelopmentController.getPartners);
router.put(
  "/partners/:id",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "business_development_partners"; // Cloudinary folder
    next();
  },
  singleUpload("file"), // frontend must send "file"
  businessDevelopmentController.updatePartner
);
router.delete(
  "/partners/:id",
  authenticate,
  businessDevelopmentController.deletePartner
);

// ===== Success Stories =====
router.post(
  "/success-stories",
  authenticate,
  businessDevelopmentController.createSuccessStory
);
router.get("/success-stories", businessDevelopmentController.getSuccessStories);
router.put(
  "/success-stories/:id",
  authenticate,
  businessDevelopmentController.updateSuccessStory
);
router.delete(
  "/success-stories/:id",
  authenticate,
  businessDevelopmentController.deleteSuccessStory
);

// ===== Service Items =====
router.post(
  "/service-items",
  authenticate,
  businessDevelopmentController.createServiceItem
);
router.get("/service-items", businessDevelopmentController.getServiceItems);
router.put(
  "/service-items/:id",
  authenticate,
  businessDevelopmentController.updateServiceItem
);
router.delete(
  "/service-items/:id",
  authenticate,
  businessDevelopmentController.deleteServiceItem
);

module.exports = router;
