const express = require("express");
const router = express.Router();
const footerController = require("../../controllers/footer/footerController");
const { authenticate } = require("../../middlewares/authMiddleware");
const { checkPagePermission } = require("../../middlewares/permissionMiddleware");
const { singleUpload } = require("../../middlewares/upload");

// Public Routes
router.get("/", footerController.getFooter);

// Protected Routes (admin access)
router.put(
  "/",
  authenticate,
  checkPagePermission("footer"),
  (req, res, next) => {
    req.uploadFolder = "footer"; // Cloudinary folder
    next();
  },
  singleUpload("logo"), // Handle logo file upload
  footerController.updateFooter
);

module.exports = router;
