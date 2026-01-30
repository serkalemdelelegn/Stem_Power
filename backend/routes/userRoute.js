const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  authenticate,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// Login User
router.post("/login", userController.login);

// Logout User
router.post("/logout", userController.logout);

// Get current user (authenticated)
router.get("/me", authenticate, userController.getCurrentUser);

// Update current user (authenticated)
router.put("/me", authenticate, userController.updateCurrentUser);

// Change password for current user (authenticated)
router.post("/me/change-password", authenticate, userController.changePassword);

// Create User (admin only)
router.post(
  "/",
  // authenticate,
  // authorizeRoles("admin"),
  userController.createUser
);

// Get all Users
router.get("/", userController.getUsers);

// Get single User
router.get("/:id", userController.getUserById);

// Update User (admin only)
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  userController.updateUser
);

// Delete User (admin only)
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  userController.deleteUser
);

module.exports = router;
