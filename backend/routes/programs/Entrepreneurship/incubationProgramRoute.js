const express = require("express");
const router = express.Router();
const incubationProgramController = require("../../../controllers/programs/Entrepreneurship/incubationProgramController");
const { singleUpload } = require("../../../middlewares/upload");
const { authenticate } = require("../../../middlewares/authMiddleware");

// ===== Hero (Incubation Program) =====
router.post("/hero", authenticate, incubationProgramController.createHero);
router.get("/hero", incubationProgramController.getHero);
router.put("/hero/:id", authenticate, incubationProgramController.updateHero);
router.delete(
  "/hero/:id",
  authenticate,
  incubationProgramController.deleteHero
);

// ===== Programs =====
router.post(
  "/programs",
  authenticate,
  incubationProgramController.createProgram
);
router.get("/programs", incubationProgramController.getPrograms);
router.get("/programs/:id", incubationProgramController.getProgramById);
router.put(
  "/programs/:id",
  authenticate,
  incubationProgramController.updateProgram
);
router.delete(
  "/programs/:id",
  authenticate,
  incubationProgramController.deleteProgram
);

// ===== Courses =====
router.post(
  "/courses",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "incubation_courses"; // Cloudinary folder
    next();
  },
  singleUpload("file"), // frontend must send "file"
  incubationProgramController.createCourse
);
router.get("/courses", incubationProgramController.getCourses);
router.put(
  "/courses/:id",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "incubation_courses"; // Cloudinary folder
    next();
  },
  singleUpload("file"), // frontend must send "file"
  incubationProgramController.updateCourse
);
router.delete(
  "/courses/:id",
  authenticate,
  incubationProgramController.deleteCourse
);

// ===== Stats =====
router.post("/stats", authenticate, incubationProgramController.createStat);
router.get("/stats", incubationProgramController.getStats);
router.put("/stats/:id", authenticate, incubationProgramController.updateStat);
router.delete(
  "/stats/:id",
  authenticate,
  incubationProgramController.deleteStat
);

// ===== Success Stories =====
router.post(
  "/success-stories",
  authenticate,
  incubationProgramController.createSuccessStory
);
router.get("/success-stories", incubationProgramController.getSuccessStories);
router.put(
  "/success-stories/:id",
  authenticate,
  incubationProgramController.updateSuccessStory
);
router.delete(
  "/success-stories/:id",
  authenticate,
  incubationProgramController.deleteSuccessStory
);

module.exports = router;
