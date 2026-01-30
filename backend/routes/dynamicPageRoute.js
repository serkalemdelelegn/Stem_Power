const express = require("express");
const router = express.Router();
const dynamicPageController = require("../controllers/dynamicPageController");
const { authenticate } = require("../middlewares/authMiddleware");
const { checkDynamicPagePermission } = require("../middlewares/permissionMiddleware");

router.get("/", dynamicPageController.getPages);
router.get("/slug/:slug", dynamicPageController.getPageBySlug);
router.get("/:id", dynamicPageController.getPageById);
// For dynamic pages, check permissions based on program field (latest vs programs)
router.post("/", authenticate, checkDynamicPagePermission, dynamicPageController.createPage);
router.put("/:id", authenticate, checkDynamicPagePermission, dynamicPageController.updatePage);
router.delete("/:id", authenticate, checkDynamicPagePermission, dynamicPageController.deletePage);

module.exports = router;
