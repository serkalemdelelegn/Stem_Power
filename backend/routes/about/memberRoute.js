const express = require("express");
const router = express.Router();
const memberController = require("../../controllers/about/memberController");
const { singleUpload } = require("../../middlewares/upload");
const { authenticate } = require("../../middlewares/authMiddleware");

// Create Member
router.post(
  "/",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "members"; // dynamic Cloudinary folder
    next();
  },
  singleUpload("file"), // frontend must send "file"
  memberController.createMember
);

// Get all Members
router.get("/", memberController.getMembers);

// Get single Member
router.get("/:id", memberController.getMemberById);

// Update Member
router.put(
  "/:id",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "members";
    next();
  },
  singleUpload("file"),
  memberController.updateMember
);

// Delete Member
router.delete("/:id", authenticate, memberController.deleteMember);

module.exports = router;
