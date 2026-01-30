const express = require("express");
const router = express.Router();
const impactController = require("../../controllers/home/impactController");
const { authenticate } = require("../../middlewares/authMiddleware");

// Create ImpactDashboard entry
router.post("/", authenticate, impactController.createImpact);

// Get all ImpactDashboard entries
router.get("/", impactController.getImpacts);

// Get single ImpactDashboard entry
router.get("/:id", impactController.getImpactById);

// Update ImpactDashboard entry
router.put("/:id", authenticate, impactController.updateImpact);

// Delete ImpactDashboard entry
router.delete("/:id", authenticate, impactController.deleteImpact);

module.exports = router;
