const express = require("express");
const router = express.Router();
const quickLinkController = require("../../controllers/footer/quickLinksController");
const { authenticate } = require("../../middlewares/authMiddleware"); // protect admin routes

// Public Routes
router.get("/", quickLinkController.getAllQuickLinks);
router.get("/:id", quickLinkController.getQuickLinkById);

// Protected Routes (admin access)
router.post("/", authenticate, quickLinkController.createQuickLink);
router.put("/:id", authenticate, quickLinkController.updateQuickLink);
router.delete("/:id", authenticate, quickLinkController.deleteQuickLink);

module.exports = router;
