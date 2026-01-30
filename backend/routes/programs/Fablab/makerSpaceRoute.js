const express = require("express");
const router = express.Router();
const makeSpaceController = require("../../../controllers/programs/Fablab/makeSpaceController");
const { singleUpload } = require("../../../middlewares/upload");
const { authenticate } = require("../../../middlewares/authMiddleware");

// ===== Maker Spaces =====
router.post("/", authenticate, makeSpaceController.createMakerSpace);
router.get("/", makeSpaceController.getMakerSpaces);

// ===== Hero =====
router.post(
  "/hero",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "maker_space_hero"; // Cloudinary folder
    next();
  },
  singleUpload("file"), // frontend must send "file"
  makeSpaceController.createHero
);
router.get("/hero", makeSpaceController.getHeroes);
router.get("/hero/:id", makeSpaceController.getHeroById);
router.put(
  "/hero/:id",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "maker_space_hero"; // Cloudinary folder
    next();
  },
  singleUpload("file"), // frontend must send "file"
  makeSpaceController.updateHero
);
router.delete("/hero/:id", authenticate, makeSpaceController.deleteHero);

// ===== Stats =====
router.post("/stats", authenticate, makeSpaceController.createStat);
router.get("/stats", makeSpaceController.getStats);
router.put("/stats/:id", authenticate, makeSpaceController.updateStat);
router.delete("/stats/:id", authenticate, makeSpaceController.deleteStat);

// ===== Gallery =====
router.post(
  "/gallery",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "maker_space_gallery"; // Cloudinary folder
    next();
  },
  singleUpload("file"), // frontend must send "file"
  makeSpaceController.createGalleryItem
);
router.get("/gallery", makeSpaceController.getGalleryItems);
router.put(
  "/gallery/:id",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "maker_space_gallery"; // Cloudinary folder
    next();
  },
  singleUpload("file"), // frontend must send "file"
  makeSpaceController.updateGalleryItem
);
router.delete(
  "/gallery/:id",
  authenticate,
  makeSpaceController.deleteGalleryItem
);

// ===== Workshops =====
router.post(
  "/workshops",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "maker_space_workshops"; // Cloudinary folder
    next();
  },
  singleUpload("file"), // frontend must send "file"
  makeSpaceController.createWorkshop
);
router.get("/workshops", makeSpaceController.getWorkshops);
router.put(
  "/workshops/:id",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "maker_space_workshops"; // Cloudinary folder
    next();
  },
  singleUpload("file"), // frontend must send "file"
  makeSpaceController.updateWorkshop
);
router.delete(
  "/workshops/:id",
  authenticate,
  makeSpaceController.deleteWorkshop
);

// ===== Features =====
router.post(
  "/features",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "maker_space_features"; // Cloudinary folder
    next();
  },
  singleUpload("file"), // frontend must send "file"
  makeSpaceController.createFeature
);
router.get("/features", makeSpaceController.getFeatures);
router.get("/features/:id", makeSpaceController.getFeatureById);
router.put(
  "/features/:id",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "maker_space_features"; // Cloudinary folder
    next();
  },
  singleUpload("file"), // frontend must send "file"
  makeSpaceController.updateFeature
);
router.delete("/features/:id", authenticate, makeSpaceController.deleteFeature);

// ===== Maker Spaces (with ID) - Must be last =====
router.get("/:id", makeSpaceController.getMakerSpaceById);
router.put("/:id", authenticate, makeSpaceController.updateMakerSpace);
router.delete("/:id", authenticate, makeSpaceController.deleteMakerSpace);

module.exports = router;
