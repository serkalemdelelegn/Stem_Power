const express = require("express");
const router = express.Router();
const trainingConsultancyController = require("../../../controllers/programs/Fablab/traningConsultancyController");
const { singleUpload } = require("../../../middlewares/upload");
const { authenticate } = require("../../../middlewares/authMiddleware");

// ===== Hero =====
router.post("/hero", authenticate, trainingConsultancyController.createHero);
router.get("/hero", trainingConsultancyController.getHeroes);
router.get("/hero/:id", trainingConsultancyController.getHeroById);
router.put("/hero/:id", authenticate, trainingConsultancyController.updateHero);
router.delete(
  "/hero/:id",
  authenticate,
  trainingConsultancyController.deleteHero
);

// ===== Training Programs (Offerings) =====
router.post(
  "/programs",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "training_consultancy_programs";
    next();
  },
  singleUpload("file"),
  trainingConsultancyController.createTrainingProgram
);
router.get("/programs", trainingConsultancyController.getTrainingPrograms);
router.get(
  "/programs/:id",
  trainingConsultancyController.getTrainingProgramById
);
router.put(
  "/programs/:id",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "training_consultancy_programs";
    next();
  },
  singleUpload("file"),
  trainingConsultancyController.updateTrainingProgram
);
router.delete(
  "/programs/:id",
  authenticate,
  trainingConsultancyController.deleteTrainingProgram
);

// ===== Partners =====
router.post(
  "/partners",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "training_consultancy_partners";
    next();
  },
  singleUpload("file"),
  trainingConsultancyController.createPartner
);
router.get("/partners", trainingConsultancyController.getPartners);
router.get("/partners/:id", trainingConsultancyController.getPartnerById);
router.put(
  "/partners/:id",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "training_consultancy_partners";
    next();
  },
  singleUpload("file"),
  trainingConsultancyController.updatePartner
);
router.delete(
  "/partners/:id",
  authenticate,
  trainingConsultancyController.deletePartner
);

// ===== Partners Section =====
router.post(
  "/partners-section",
  authenticate,
  trainingConsultancyController.createPartnersSection
);
router.get(
  "/partners-section",
  trainingConsultancyController.getPartnersSections
);
router.get(
  "/partners-section/:id",
  trainingConsultancyController.getPartnersSectionById
);
router.put(
  "/partners-section/:id",
  authenticate,
  trainingConsultancyController.updatePartnersSection
);
router.delete(
  "/partners-section/:id",
  authenticate,
  trainingConsultancyController.deletePartnersSection
);

// ===== Consultancies =====
router.post("/", authenticate, trainingConsultancyController.createConsultancy);
router.get("/", trainingConsultancyController.getConsultancies);

// ===== Consultancy Stats =====
router.post(
  "/stats",
  authenticate,
  trainingConsultancyController.createConsultancyStat
);
router.get("/stats", trainingConsultancyController.getConsultancyStats);
router.put(
  "/stats/:id",
  authenticate,
  trainingConsultancyController.updateConsultancyStat
);
router.delete(
  "/stats/:id",
  authenticate,
  trainingConsultancyController.deleteConsultancyStat
);

// ===== Percentage Stats =====
router.post(
  "/percentage-stats",
  authenticate,
  trainingConsultancyController.createPercentageStat
);
router.get(
  "/percentage-stats",
  trainingConsultancyController.getPercentageStats
);
router.put(
  "/percentage-stats/:id",
  authenticate,
  trainingConsultancyController.updatePercentageStat
);
router.delete(
  "/percentage-stats/:id",
  authenticate,
  trainingConsultancyController.deletePercentageStat
);

// ===== Pages =====
router.post("/pages", authenticate, trainingConsultancyController.createPage);
router.get("/pages", trainingConsultancyController.getPages);
router.get("/pages/:id", trainingConsultancyController.getPageById);
router.put(
  "/pages/:id",
  authenticate,
  trainingConsultancyController.updatePage
);
router.delete(
  "/pages/:id",
  authenticate,
  trainingConsultancyController.deletePage
);

// ===== Page Stats =====
router.post(
  "/page-stats",
  authenticate,
  trainingConsultancyController.createPageStat
);
router.get("/page-stats", trainingConsultancyController.getPageStats);
router.put(
  "/page-stats/:id",
  authenticate,
  trainingConsultancyController.updatePageStat
);
router.delete(
  "/page-stats/:id",
  authenticate,
  trainingConsultancyController.deletePageStat
);

// ===== Success Metrics =====
router.post(
  "/success-metrics",
  authenticate,
  trainingConsultancyController.createSuccessMetric
);
router.get("/success-metrics", trainingConsultancyController.getSuccessMetrics);
router.get(
  "/success-metrics/:id",
  trainingConsultancyController.getSuccessMetricById
);
router.put(
  "/success-metrics/:id",
  authenticate,
  trainingConsultancyController.updateSuccessMetric
);
router.delete(
  "/success-metrics/:id",
  authenticate,
  trainingConsultancyController.deleteSuccessMetric
);

// ===== Consultancy Services =====
router.post(
  "/consultancy-services",
  authenticate,
  trainingConsultancyController.createConsultancyService
);
router.get(
  "/consultancy-services",
  trainingConsultancyController.getConsultancyServices
);
router.get(
  "/consultancy-services/:id",
  trainingConsultancyController.getConsultancyServiceById
);
router.put(
  "/consultancy-services/:id",
  authenticate,
  trainingConsultancyController.updateConsultancyService
);
router.delete(
  "/consultancy-services/:id",
  authenticate,
  trainingConsultancyController.deleteConsultancyService
);

// ===== Partnership Types =====
router.post(
  "/partnership-types",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "training_consultancy_partnership_types";
    next();
  },
  // Handle file uploads (only for multipart/form-data)
  (req, res, next) => {
    const contentType = req.headers["content-type"] || "";
    // Only use multer for multipart/form-data
    if (contentType.includes("multipart/form-data")) {
      singleUpload("file")(req, res, (err) => {
        if (err) {
          return res.status(400).json({ message: err.message });
        }
        next();
      });
    } else {
      // For JSON requests, skip multer
      next();
    }
  },
  trainingConsultancyController.createPartnershipType
);
router.get(
  "/partnership-types",
  trainingConsultancyController.getPartnershipTypes
);
router.get(
  "/partnership-types/:id",
  trainingConsultancyController.getPartnershipTypeById
);
router.put(
  "/partnership-types/:id",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "training_consultancy_partnership_types";
    next();
  },
  // Handle file uploads (only for multipart/form-data)
  (req, res, next) => {
    const contentType = req.headers["content-type"] || "";
    // Only use multer for multipart/form-data
    if (contentType.includes("multipart/form-data")) {
      singleUpload("file")(req, res, (err) => {
        if (err) {
          return res.status(400).json({ message: err.message });
        }
        next();
      });
    } else {
      // For JSON requests, skip multer
      next();
    }
  },
  trainingConsultancyController.updatePartnershipType
);
router.delete(
  "/partnership-types/:id",
  authenticate,
  trainingConsultancyController.deletePartnershipType
);

// ===== Consultancies (with ID) - Must be last =====
router.get("/:id", trainingConsultancyController.getConsultancyById);
router.put(
  "/:id",
  authenticate,
  trainingConsultancyController.updateConsultancy
);
router.delete(
  "/:id",
  authenticate,
  trainingConsultancyController.deleteConsultancy
);

module.exports = router;
