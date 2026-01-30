const express = require("express");
const router = express.Router();
const footerSectionController = require("../../controllers/footer/footerSectionController");
const { authenticate } = require("../../middlewares/authMiddleware");
const { checkPagePermission } = require("../../middlewares/permissionMiddleware");

// Public Routes
router.get("/", footerSectionController.getAllSections);
router.get("/:id", footerSectionController.getSectionById);

// Protected Routes (admin access)
router.post("/", authenticate, checkPagePermission("footer"), footerSectionController.createSection);
router.put("/:id", authenticate, checkPagePermission("footer"), footerSectionController.updateSection);
router.delete("/:id", authenticate, checkPagePermission("footer"), footerSectionController.deleteSection);

module.exports = router;
