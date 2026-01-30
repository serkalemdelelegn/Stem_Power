const express = require("express");
const router = express.Router();
const announcementController = require("../../controllers/latest/announcementModel");
const { authenticate } = require("../../middlewares/authMiddleware");
const { checkPagePermission } = require("../../middlewares/permissionMiddleware");
const { singleUpload } = require("../../middlewares/upload");

// ===== Announcements Hero =====
router.post(
  "/hero",
  authenticate,
  checkPagePermission("latest"),
  announcementController.createAnnouncementsHero
);
router.get("/hero", announcementController.getAnnouncementsHeroes);
router.get("/hero/:id", announcementController.getAnnouncementsHeroById);
router.put(
  "/hero/:id",
  authenticate,
  checkPagePermission("latest"),
  announcementController.updateAnnouncementsHero
);
router.delete(
  "/hero/:id",
  authenticate,
  checkPagePermission("latest"),
  announcementController.deleteAnnouncementsHero
);

// Public: Get active announcements
router.get("/", announcementController.getActiveAnnouncements);

//  Admin: Manage announcements
router.post(
  "/",
  authenticate,
  checkPagePermission("latest"),
  (req, res, next) => {
    req.uploadFolder = "announcements";
    next();
  },
  singleUpload("file"),
  announcementController.createAnnouncement
);
router.get("/all", announcementController.getAllAnnouncements);
router.get("/:id", announcementController.getAnnouncementById);
router.put(
  "/:id",
  authenticate,
  checkPagePermission("latest"),
  (req, res, next) => {
    req.uploadFolder = "announcements";
    next();
  },
  singleUpload("file"),
  announcementController.updateAnnouncement
);
router.delete("/:id", authenticate, checkPagePermission("latest"), announcementController.deleteAnnouncement);

module.exports = router;
