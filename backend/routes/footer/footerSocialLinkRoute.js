const express = require("express");
const router = express.Router();
const footerSocialLinkController = require("../../controllers/footer/footerSocialLinkController");
const { authenticate } = require("../../middlewares/authMiddleware");

// Public Routes
router.get("/", footerSocialLinkController.getAllSocialLinks);
router.get("/:id", footerSocialLinkController.getSocialLinkById);

// Protected Routes (admin access)
router.post("/", authenticate, footerSocialLinkController.createSocialLink);
router.put("/:id", authenticate, footerSocialLinkController.updateSocialLink);
router.delete(
  "/:id",
  authenticate,
  footerSocialLinkController.deleteSocialLink
);

module.exports = router;
