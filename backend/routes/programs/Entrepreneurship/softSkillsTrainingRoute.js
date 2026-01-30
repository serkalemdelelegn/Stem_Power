const express = require("express");
const router = express.Router();
const softSkillsTrainingController = require("../../../controllers/programs/Entrepreneurship/softSkillsTrainingController");
const { singleUpload } = require("../../../middlewares/upload");
const { authenticate } = require("../../../middlewares/authMiddleware");

// ===== Hero (Soft Skill Training) =====
router.post("/hero", authenticate, softSkillsTrainingController.createHero);
router.get("/hero", softSkillsTrainingController.getHero);
router.put("/hero/:id", authenticate, softSkillsTrainingController.updateHero);
router.delete(
  "/hero/:id",
  authenticate,
  softSkillsTrainingController.deleteHero
);

// ===== Trainings =====
router.post(
  "/trainings",
  authenticate,
  softSkillsTrainingController.createTraining
);
router.get("/trainings", softSkillsTrainingController.getTrainings);
router.get("/trainings/:id", softSkillsTrainingController.getTrainingById);
router.put(
  "/trainings/:id",
  authenticate,
  softSkillsTrainingController.updateTraining
);
router.delete(
  "/trainings/:id",
  authenticate,
  softSkillsTrainingController.deleteTraining
);

// ===== Programs =====
router.post(
  "/programs",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "soft_skills_programs"; // Cloudinary folder
    next();
  },
  singleUpload("file"), // frontend must send "file"
  softSkillsTrainingController.createProgram
);
router.get("/programs", softSkillsTrainingController.getPrograms);
router.put(
  "/programs/:id",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "soft_skills_programs"; // Cloudinary folder
    next();
  },
  singleUpload("file"), // frontend must send "file"
  softSkillsTrainingController.updateProgram
);
router.delete(
  "/programs/:id",
  authenticate,
  softSkillsTrainingController.deleteProgram
);

// ===== Statistics =====
router.post("/stats", authenticate, softSkillsTrainingController.createStat);
router.get("/stats", softSkillsTrainingController.getStats);
router.put("/stats/:id", authenticate, softSkillsTrainingController.updateStat);
router.delete(
  "/stats/:id",
  authenticate,
  softSkillsTrainingController.deleteStat
);

module.exports = router;
