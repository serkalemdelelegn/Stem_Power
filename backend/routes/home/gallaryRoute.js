const express = require("express");
const router = express.Router();
const galleryController = require("../../controllers/home/gallaryController");
const { singleUpload } = require("../../middlewares/upload");
const { authenticate } = require("../../middlewares/authMiddleware");

// Create Gallery item
router.post(
  "/",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "rotating_gallery"; // dynamic Cloudinary folder
    next();
  },
  singleUpload("file"), // frontend must send "file"
  galleryController.createGallery
);

// Get all Gallery items
router.get("/", galleryController.getGallery);

// Get single Gallery item
router.get("/:id", galleryController.getGalleryById);

// Update Gallery item
router.put(
  "/:id",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "rotating_gallery";
    next();
  },
  singleUpload("file"),
  galleryController.updateGallery
);

// Delete Gallery item
router.delete("/:id", authenticate, galleryController.deleteGallery);

module.exports = router;
