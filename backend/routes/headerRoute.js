const express = require("express");
const router = express.Router();
const headerController = require("../controllers/headerController");
const { authenticate } = require("../middlewares/authMiddleware");
const { checkPagePermission } = require("../middlewares/permissionMiddleware");

router.get("/", headerController.getHeaderLinks);
router.get("/:id", headerController.getHeaderLinkById);
router.post("/", authenticate, checkPagePermission("header"), headerController.createHeaderLink);
router.put("/:id", authenticate, checkPagePermission("header"), headerController.updateHeaderLink);
router.delete("/:id", authenticate, checkPagePermission("header"), headerController.deleteHeaderLink);

module.exports = router;
