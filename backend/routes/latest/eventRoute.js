const express = require("express");
const router = express.Router();
const eventController = require("../../controllers/latest/eventController");
const { singleUpload } = require("../../middlewares/upload"); // handles file upload
const { authenticate } = require("../../middlewares/authMiddleware"); // for protected routes
const { checkPagePermission } = require("../../middlewares/permissionMiddleware");

// ===== Events Hero =====
router.post(
  "/hero",
  authenticate,
  checkPagePermission("latest"),
  (req, res, next) => {
    req.uploadFolder = "events_hero";
    next();
  },
  singleUpload("file"),
  eventController.createEventsHero
);
router.get("/hero", eventController.getEventsHeroes);
router.get("/hero/:id", eventController.getEventsHeroById);
router.put(
  "/hero/:id",
  authenticate,
  checkPagePermission("latest"),
  (req, res, next) => {
    req.uploadFolder = "events_hero";
    next();
  },
  singleUpload("file"),
  eventController.updateEventsHero
);
router.delete("/hero/:id", authenticate, checkPagePermission("latest"), eventController.deleteEventsHero);

// ===== Events CRUD =====
router.post(
  "/",
  authenticate,
  checkPagePermission("latest"),
  (req, res, next) => {
    req.uploadFolder = "events";
    next();
  },
  singleUpload("file"),
  eventController.createEvent
);
router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);
router.put(
  "/:id",
  authenticate,
  checkPagePermission("latest"),
  (req, res, next) => {
    req.uploadFolder = "events";
    next();
  },
  singleUpload("file"),
  eventController.updateEvent
);
router.delete("/:id", authenticate, checkPagePermission("latest"), eventController.deleteEvent);

module.exports = router;
