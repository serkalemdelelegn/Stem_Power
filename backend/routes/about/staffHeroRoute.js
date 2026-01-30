const express = require("express");
const router = express.Router();
const staffHeroController = require("../../controllers/about/staffHeroController");
const { authenticate } = require("../../middlewares/authMiddleware");

// ===== Staff Hero Stats (must come before /:id routes) =====
router.post("/stats", authenticate, staffHeroController.createStat);
router.get("/stats", staffHeroController.getStats);
router.get("/stats/:id", staffHeroController.getStatById);
router.put("/stats/:id", authenticate, staffHeroController.updateStat);
router.delete("/stats/:id", authenticate, staffHeroController.deleteStat);

// ===== Staff Hero =====
router.post("/", authenticate, staffHeroController.createHero);
router.get("/", staffHeroController.getHeroes);
router.get("/:id", staffHeroController.getHeroById);
router.put("/:id", authenticate, staffHeroController.updateHero);
router.delete("/:id", authenticate, staffHeroController.deleteHero);

module.exports = router;
