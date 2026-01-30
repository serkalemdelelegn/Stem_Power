const express = require("express");
const router = express.Router();
const stemTvController = require("../../../controllers/programs/StemCenter/stemTvController");
const { authenticate } = require("../../../middlewares/authMiddleware");

// STEM TV routes
router.post("/", authenticate, stemTvController.createStemTv);
router.get("/", stemTvController.getStemTvVideos);
router.get("/:id", stemTvController.getStemTvById);
router.put("/:id", authenticate, stemTvController.updateStemTv);
router.delete("/:id", authenticate, stemTvController.deleteStemTv);

module.exports = router;
