const express = require("express");
const router = express.Router();
const newsletterController = require("../../controllers/contact_us/newsletterSubscriberController");

// Subscribe
router.post("/", newsletterController.createSubscriber);

// Get all subscribers
router.get("/", newsletterController.getSubscribers);

// Get single subscriber by ID
router.get("/:id", newsletterController.getSubscriberById);

// Delete subscriber
router.delete("/:id", newsletterController.deleteSubscriber);

module.exports = router;
