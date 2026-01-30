const express = require("express");
const router = express.Router();
const fablabServicesController = require("../../../controllers/programs/Fablab/fablabServicesController");
const { singleUpload } = require("../../../middlewares/upload");
const { authenticate } = require("../../../middlewares/authMiddleware");

// ===== Hero =====
router.post("/hero", authenticate, fablabServicesController.createHero);
router.get("/hero", fablabServicesController.getHeroes);
router.get("/hero/:id", fablabServicesController.getHeroById);
router.put("/hero/:id", authenticate, fablabServicesController.updateHero);
router.delete("/hero/:id", authenticate, fablabServicesController.deleteHero);

// ===== Stats =====
router.post("/stats", authenticate, fablabServicesController.createStat);
router.get("/stats", fablabServicesController.getStats);
router.put("/stats/:id", authenticate, fablabServicesController.updateStat);
router.delete("/stats/:id", authenticate, fablabServicesController.deleteStat);

// ===== Services =====
router.post(
  "/services",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "fablab_services"; // Cloudinary folder
    next();
  },
  singleUpload("file"), // frontend must send "file"
  fablabServicesController.createService
);
router.get("/services", fablabServicesController.getServices);

// ===== Features =====
router.post("/features", authenticate, fablabServicesController.createFeature);
router.get("/features", fablabServicesController.getFeatures);
router.put(
  "/features/:id",
  authenticate,
  fablabServicesController.updateFeature
);
router.delete(
  "/features/:id",
  authenticate,
  fablabServicesController.deleteFeature
);

// ===== Applications =====
router.post(
  "/applications",
  authenticate,
  fablabServicesController.createApplication
);
router.get("/applications", fablabServicesController.getApplications);
router.put(
  "/applications/:id",
  authenticate,
  fablabServicesController.updateApplication
);
router.delete(
  "/applications/:id",
  authenticate,
  fablabServicesController.deleteApplication
);

// ===== Benefits =====
router.post("/benefits", authenticate, fablabServicesController.createBenefit);
router.get("/benefits", fablabServicesController.getBenefits);
router.get("/benefits/:id", fablabServicesController.getBenefitById);
router.put(
  "/benefits/:id",
  authenticate,
  fablabServicesController.updateBenefit
);
router.delete(
  "/benefits/:id",
  authenticate,
  fablabServicesController.deleteBenefit
);

// ===== Machineries (alias for services) =====
router.get("/machineries", fablabServicesController.getMachineries);

// ===== Services (with ID) - Must be last =====
router.get("/services/:id", fablabServicesController.getServiceById);
router.put(
  "/services/:id",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "fablab_services"; // Cloudinary folder
    next();
  },
  singleUpload("file"), // frontend must send "file"
  fablabServicesController.updateService
);
router.delete(
  "/services/:id",
  authenticate,
  fablabServicesController.deleteService
);

module.exports = router;
