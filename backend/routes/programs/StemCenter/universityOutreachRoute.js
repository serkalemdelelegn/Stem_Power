const express = require("express");
const router = express.Router();
const universityOutreachController = require("../../../controllers/programs/StemCenter/universityOutreachController");
const { singleUpload } = require("../../../middlewares/upload");
const { authenticate } = require("../../../middlewares/authMiddleware");

// ===== University Outreach =====
router.post("/", authenticate, universityOutreachController.createOutreach);
router.get("/", universityOutreachController.getOutreach);

// ===== Universities =====
router.post(
  "/universities",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "university_outreach/universities";
    next();
  },
  singleUpload("file"),
  universityOutreachController.createUniversity
);
router.get("/universities", universityOutreachController.getUniversities);
router.get("/universities/:id", universityOutreachController.getUniversityById);
router.put(
  "/universities/:id",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "university_outreach/universities";
    next();
  },
  singleUpload("file"),
  universityOutreachController.updateUniversity
);
router.delete(
  "/universities/:id",
  authenticate,
  universityOutreachController.deleteUniversity
);

// ===== Impact Stats =====
router.post(
  "/impact-stats",
  authenticate,
  universityOutreachController.createImpactStat
);
router.get("/impact-stats", universityOutreachController.getImpactStats);
router.get("/impact-stats/:id", universityOutreachController.getImpactStatById);
router.put(
  "/impact-stats/:id",
  authenticate,
  universityOutreachController.updateImpactStat
);
router.delete(
  "/impact-stats/:id",
  authenticate,
  universityOutreachController.deleteImpactStat
);

// ===== Program Benefits =====
router.post(
  "/program-benefits",
  authenticate,
  universityOutreachController.createProgramBenefit
);
router.get(
  "/program-benefits",
  universityOutreachController.getProgramBenefits
);
router.get(
  "/program-benefits/:id",
  universityOutreachController.getProgramBenefitById
);
router.put(
  "/program-benefits/:id",
  authenticate,
  universityOutreachController.updateProgramBenefit
);
router.delete(
  "/program-benefits/:id",
  authenticate,
  universityOutreachController.deleteProgramBenefit
);

// ===== Timeline =====
router.post(
  "/timelines",
  authenticate,
  universityOutreachController.createTimeline
);
router.get("/timelines", universityOutreachController.getTimelines);
router.get("/timelines/:id", universityOutreachController.getTimelineById);
router.put(
  "/timelines/:id",
  authenticate,
  universityOutreachController.updateTimeline
);
router.delete(
  "/timelines/:id",
  authenticate,
  universityOutreachController.deleteTimeline
);

// ===== University Outreach (with ID) - Must be last =====
router.get("/:id", universityOutreachController.getOutreachById);
router.put("/:id", authenticate, universityOutreachController.updateOutreach);
router.delete(
  "/:id",
  authenticate,
  universityOutreachController.deleteOutreach
);

module.exports = router;
