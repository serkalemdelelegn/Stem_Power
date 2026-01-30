const express = require("express");
const router = express.Router();
const heroController = require("../../controllers/home/heroController");
const { singleUpload } = require("../../middlewares/upload");
const { authenticate } = require("../../middlewares/authMiddleware");
const { checkPagePermission } = require("../../middlewares/permissionMiddleware");

// Create Hero
router.post(
  "/",
  authenticate,
  checkPagePermission("home"),
  (req, res, next) => {
    req.uploadFolder = "hero_section"; // dynamic Cloudinary folder
    next();
  },
  singleUpload("file"), // frontend must send "file"
  heroController.createHero
);

// Get all Heroes
router.get("/", heroController.getHeros);

// Get single Hero
router.get("/:id", heroController.getHeroById);

// Update Hero
router.put(
  "/:id",
  authenticate,
  checkPagePermission("home"),
  (req, res, next) => {
    req.uploadFolder = "hero_section";
    next();
  },
  singleUpload("file"),
  heroController.updateHero
);

// Delete Hero
router.delete("/:id", authenticate, checkPagePermission("home"), heroController.deleteHero);

module.exports = router;
