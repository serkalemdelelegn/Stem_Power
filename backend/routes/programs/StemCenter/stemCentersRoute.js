const express = require("express");
const router = express.Router();
const stemCentersController = require("../../../controllers/programs/StemCenter/stemCentersController");
const { singleUpload } = require("../../../middlewares/upload");
const { authenticate } = require("../../../middlewares/authMiddleware");
const { checkPagePermission } = require("../../../middlewares/permissionMiddleware");

// ===== Hero =====
router.post("/hero", authenticate, checkPagePermission("programs"), stemCentersController.createHero);
router.get("/hero", stemCentersController.getHeroes);
router.get("/hero/:id", stemCentersController.getHeroById);
router.put("/hero/:id", authenticate, checkPagePermission("programs"), stemCentersController.updateHero);
router.delete("/hero/:id", authenticate, checkPagePermission("programs"), stemCentersController.deleteHero);

// ===== Centers =====
router.post(
  "/centers",
  authenticate,
  checkPagePermission("programs"),
  (req, res, next) => {
    req.uploadFolder = "stem_centers";
    next();
  },
  singleUpload("file"),
  stemCentersController.createCenter
);
router.get("/centers", stemCentersController.getCenters);
router.get("/centers/:id", stemCentersController.getCenterById);
router.put(
  "/centers/:id",
  authenticate,
  checkPagePermission("programs"),
  (req, res, next) => {
    req.uploadFolder = "stem_centers";
    next();
  },
  singleUpload("file"),
  stemCentersController.updateCenter
);
router.delete("/centers/:id", authenticate, checkPagePermission("programs"), stemCentersController.deleteCenter);

// ===== Center Stats =====
router.post(
  "/center-stats",
  authenticate,
  checkPagePermission("programs"),
  stemCentersController.createCenterStat
);
router.get("/center-stats", stemCentersController.getCenterStats);
router.put(
  "/center-stats/:id",
  authenticate,
  checkPagePermission("programs"),
  stemCentersController.updateCenterStat
);
router.delete(
  "/center-stats/:id",
  authenticate,
  checkPagePermission("programs"),
  stemCentersController.deleteCenterStat
);

// ===== Laboratories =====
router.post(
  "/laboratories",
  authenticate,
  checkPagePermission("programs"),
  stemCentersController.createLaboratory
);
router.get("/laboratories", stemCentersController.getLaboratories);
router.get("/laboratories/:id", stemCentersController.getLaboratoryById);
router.put(
  "/laboratories/:id",
  authenticate,
  checkPagePermission("programs"),
  stemCentersController.updateLaboratory
);
router.delete(
  "/laboratories/:id",
  authenticate,
  checkPagePermission("programs"),
  stemCentersController.deleteLaboratory
);

// ===== Laboratory Programs (for specialized programs section) =====
router.get("/laboratory-programs", stemCentersController.getLaboratoryPrograms);
router.post(
  "/laboratory-programs",
  authenticate,
  checkPagePermission("programs"),
  stemCentersController.createLaboratoryProgram
);
router.put(
  "/laboratory-programs/:id",
  authenticate,
  checkPagePermission("programs"),
  stemCentersController.updateLaboratoryProgram
);
router.delete(
  "/laboratory-programs/:id",
  authenticate,
  checkPagePermission("programs"),
  stemCentersController.deleteLaboratoryProgram
);

module.exports = router;
