const express = require("express");
const router = express.Router();
const scienceFairsController = require("../../../controllers/programs/StemCenter/scienceFairsController");
const { singleUpload } = require("../../../middlewares/upload");
const { authenticate } = require("../../../middlewares/authMiddleware");

// ===== Hero (Science Fair) =====
router.post("/hero", authenticate, scienceFairsController.createHero);
router.get("/hero", scienceFairsController.getHero);
router.put("/hero/:id", authenticate, scienceFairsController.updateHero);
router.delete("/hero/:id", authenticate, scienceFairsController.deleteHero);

// ===== Statistics (Science Fair) =====
router.post("/stats", authenticate, scienceFairsController.createStat);
router.get("/stats", scienceFairsController.getStats);
router.put("/stats/:id", authenticate, scienceFairsController.updateStat);
router.delete("/stats/:id", authenticate, scienceFairsController.deleteStat);

// ===== Journey Stages (Science Fair) =====
router.post(
  "/journey-stages",
  authenticate,
  scienceFairsController.createJourneyStage
);
router.get("/journey-stages", scienceFairsController.getJourneyStages);
router.put(
  "/journey-stages/:id",
  authenticate,
  scienceFairsController.updateJourneyStage
);
router.delete(
  "/journey-stages/:id",
  authenticate,
  scienceFairsController.deleteJourneyStage
);

// ===== Winners (Science Fair) =====
router.post(
  "/winners",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "science_fairs/winners"; // dynamic Cloudinary folder
    next();
  },
  singleUpload("file"), // frontend must send "file"
  scienceFairsController.createWinner
);
router.get("/winners", scienceFairsController.getWinners);
router.put(
  "/winners/:id",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "science_fairs/winners"; // dynamic Cloudinary folder
    next();
  },
  singleUpload("file"), // frontend must send "file"
  scienceFairsController.updateWinner
);
router.delete(
  "/winners/:id",
  authenticate,
  scienceFairsController.deleteWinner
);

// ===== Science Fairs =====
router.post("/", authenticate, scienceFairsController.createScienceFair);
router.get("/", scienceFairsController.getScienceFairs);
router.get("/:id", scienceFairsController.getScienceFairById);
router.put("/:id", authenticate, scienceFairsController.updateScienceFair);
router.delete("/:id", authenticate, scienceFairsController.deleteScienceFair);

// ===== Recognitions =====
router.post(
  "/recognitions",
  authenticate,
  scienceFairsController.createRecognition
);
router.get("/recognitions", scienceFairsController.getRecognitions);
router.get("/recognitions/:id", scienceFairsController.getRecognitionById);
router.put(
  "/recognitions/:id",
  authenticate,
  scienceFairsController.updateRecognition
);
router.delete(
  "/recognitions/:id",
  authenticate,
  scienceFairsController.deleteRecognition
);

module.exports = router;
