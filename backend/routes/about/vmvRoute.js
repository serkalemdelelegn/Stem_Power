const express = require("express");
const router = express.Router();
const vmvController = require("../../controllers/about/vmvController");
const { authenticate } = require("../../middlewares/authMiddleware");

// Get active (aggregated data for frontend)
router.get("/active", vmvController.getActive);

// Get all VMVs
router.get("/", vmvController.getVMVs);

// Create or update all sections (with file upload support)
router.post(
  "/",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "about_vmv";
    next();
  },
  // Handle file uploads (only for multipart/form-data)
  (req, res, next) => {
    const contentType = req.headers["content-type"] || "";
    // Only use multer for multipart/form-data
    if (contentType.includes("multipart/form-data")) {
      const multer = require("multer");
      const { CloudinaryStorage } = require("multer-storage-cloudinary");
      const cloudinary = require("../../config/cloudinary");

      const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req, file) => {
          let folder = req.uploadFolder || "about_vmv";
          return {
            folder: folder,
            resource_type: "auto",
            public_id: file.originalname.split(".")[0],
          };
        },
      });

      const multerUpload = multer({
        storage,
      });

      // Accept any field name for file uploads
      multerUpload.any()(req, res, (err) => {
        if (err) {
          console.error("[VMV Route] Multer error:", err);
          return res.status(400).json({ message: err.message });
        }
        next();
      });
    } else {
      // For JSON requests, skip multer
      next();
    }
  },
  vmvController.createOrUpdateAll
);

// Create VMV (single record)
router.post("/single", authenticate, vmvController.createVMV);

// Get single VMV by ID
router.get("/:id", vmvController.getVMVById);

// Update VMV
router.put("/:id", authenticate, vmvController.updateVMV);

// Delete VMV
router.delete("/:id", authenticate, vmvController.deleteVMV);

module.exports = router;
