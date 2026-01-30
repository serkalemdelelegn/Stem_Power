const express = require("express");
const router = express.Router();
const partnerController = require("../../controllers/home/partnerController");
const { singleUpload } = require("../../middlewares/upload");
const { authenticate } = require("../../middlewares/authMiddleware");

// Create Partner
router.post(
  "/",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "partners"; // Cloudinary folder
    next();
  },
  singleUpload("file"), // frontend must send `file`
  partnerController.createPartner
);

// Get all Partners
router.get("/", partnerController.getPartners);

// Get Partner by ID
router.get("/:id", partnerController.getPartnerById);

// Update Partner
router.put(
  "/:id",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "partners";
    next();
  },
  singleUpload("file"),
  partnerController.updatePartner
);

// Delete Partner
router.delete("/:id", authenticate, partnerController.deletePartner);

module.exports = router;
