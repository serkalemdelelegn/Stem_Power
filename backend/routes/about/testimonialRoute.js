const express = require("express");
const router = express.Router();
const testimonialController = require("../../controllers/about/testimonialController");
const { singleUpload } = require("../../middlewares/upload");
const { authenticate } = require("../../middlewares/authMiddleware");

// Get all active testimonials (public)
router.get("/", testimonialController.getAll);

// Get all testimonials including inactive (admin)
router.get("/all", testimonialController.getAllAdmin);

// Get testimonial by ID
router.get("/:id", testimonialController.getById);

// Create testimonial
router.post(
  "/",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "testimonials";
    next();
  },
  singleUpload("file"),
  testimonialController.create
);

// Update testimonial
router.put(
  "/:id",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "testimonials";
    next();
  },
  singleUpload("file"),
  testimonialController.update
);

// Delete testimonial
router.delete("/:id", authenticate, testimonialController.delete);

module.exports = router;
