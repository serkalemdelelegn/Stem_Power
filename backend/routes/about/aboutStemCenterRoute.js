const express = require("express");
const router = express.Router();
const aboutStemCenterController = require("../../controllers/about/aboutStemCenterController");
const { fieldsUpload } = require("../../middlewares/upload");
const { authenticate } = require("../../middlewares/authMiddleware");
const { checkPagePermission } = require("../../middlewares/permissionMiddleware");

/**
 * About STEM Center Routes
 *
 * Manages:
 * - Hero section (badge, title, description, image, statistic)
 * - Who We Are section (badge, title, description, image)
 * - Mission & Vision (mission, vision, values array)
 *
 * Note: Testimonials are managed separately via /api/about/testimonials
 */

// Get active (for public page)
router.get("/active", aboutStemCenterController.getActive);

// Get all (for admin)
router.get("/", aboutStemCenterController.getAll);

// Get by ID
router.get("/:id", aboutStemCenterController.getById);

// Create or update (upsert) - handles both JSON and FormData
router.post(
  "/",
  authenticate,
  checkPagePermission("about"),
  (req, res, next) => {
    req.uploadFolder = "about_stem_center";
    next();
  },
  // Accept multiple file fields for hero and whoWeAre images
  (req, res, next) => {
    const multer = require("multer");
    const { CloudinaryStorage } = require("multer-storage-cloudinary");
    const cloudinary = require("../../config/cloudinary");

    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: async (req, file) => {
        // Use the uploadFolder set by previous middleware
        let folder = req.uploadFolder || "about_stem_center";
        return {
          folder: folder,
          resource_type: "auto",
          public_id: file.originalname.split(".")[0],
        };
      },
    });

    const multerUpload = multer({
      storage,
    });

    // Accept any field name for flexibility (heroImage, whoWeAreImage, file, etc.)
    multerUpload.any()(req, res, (err) => {
      if (err) {
        console.error("[AboutStemCenter Route] Multer error:", err);
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  aboutStemCenterController.createOrUpdate
);

// Update by ID
router.put(
  "/:id",
  authenticate,
  checkPagePermission("about"),
  (req, res, next) => {
    req.uploadFolder = "about_stem_center";
    next();
  },
  fieldsUpload([
    { name: "file", maxCount: 1 },
    { name: "heroImage", maxCount: 1 },
    { name: "whoWeAreImage", maxCount: 1 },
    { name: "whoWeAreImageFile", maxCount: 1 },
  ]),
  aboutStemCenterController.updateById
);

// Delete by ID
router.delete("/:id", authenticate, checkPagePermission("about"), aboutStemCenterController.deleteById);

module.exports = router;
