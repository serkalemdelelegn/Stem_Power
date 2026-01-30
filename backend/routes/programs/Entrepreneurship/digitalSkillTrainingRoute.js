const express = require("express");
const router = express.Router();
const digitalSkillTrainingController = require("../../../controllers/programs/Entrepreneurship/digitalSkillTrainingController");
const { singleUpload } = require("../../../middlewares/upload");
const { authenticate } = require("../../../middlewares/authMiddleware");

// ===== Hero (Digital Skill Training) =====
router.post("/hero", authenticate, digitalSkillTrainingController.createHero);
router.get("/hero", digitalSkillTrainingController.getHero);
router.put(
  "/hero/:id",
  authenticate,
  digitalSkillTrainingController.updateHero
);
router.delete(
  "/hero/:id",
  authenticate,
  digitalSkillTrainingController.deleteHero
);

// ===== Trainings =====
router.post(
  "/trainings",
  authenticate,
  digitalSkillTrainingController.createTraining
);
router.get("/trainings", digitalSkillTrainingController.getTrainings);
router.get("/trainings/:id", digitalSkillTrainingController.getTrainingById);
router.put(
  "/trainings/:id",
  authenticate,
  digitalSkillTrainingController.updateTraining
);
router.delete(
  "/trainings/:id",
  authenticate,
  digitalSkillTrainingController.deleteTraining
);

// ===== Programs =====
router.post(
  "/programs",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "digital_skills_programs"; // Cloudinary folder
    next();
  },
  singleUpload("file"), // frontend must send "file"
  digitalSkillTrainingController.createProgram
);
router.get("/programs", digitalSkillTrainingController.getPrograms);
router.put(
  "/programs/:id",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "digital_skills_programs"; // Cloudinary folder
    next();
  },
  singleUpload("file"), // frontend must send "file"
  digitalSkillTrainingController.updateProgram
);
router.delete(
  "/programs/:id",
  authenticate,
  digitalSkillTrainingController.deleteProgram
);

// ===== Statistics =====
router.post("/stats", authenticate, digitalSkillTrainingController.createStat);
router.get("/stats", digitalSkillTrainingController.getStats);
router.put(
  "/stats/:id",
  authenticate,
  digitalSkillTrainingController.updateStat
);
router.delete(
  "/stats/:id",
  authenticate,
  digitalSkillTrainingController.deleteStat
);

module.exports = router;
