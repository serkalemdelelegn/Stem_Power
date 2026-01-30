const express = require("express");
const router = express.Router();
const socialLinkController = require("../../controllers/contact_us/socialLinkController");
const { authenticate } = require("../../middlewares/authMiddleware");
const { checkPagePermission } = require("../../middlewares/permissionMiddleware");

// Create a social link
router.post("/", authenticate, checkPagePermission("contact"), socialLinkController.createSocialLink);

// Get all social links
router.get("/", socialLinkController.getSocialLinks);

// Get a single social link by ID
router.get("/:id", socialLinkController.getSocialLinkById);

// Update a social link
router.put("/:id", authenticate, checkPagePermission("contact"), socialLinkController.updateSocialLink);

// Delete a social link
router.delete("/:id", authenticate, checkPagePermission("contact"), socialLinkController.deleteSocialLink);

module.exports = router;
