const express = require("express");
const router = express.Router();
const contactOfficeController = require("../../controllers/contact_us/contactOfficeController");
const { authenticate } = require("../../middlewares/authMiddleware");
const { checkPagePermission } = require("../../middlewares/permissionMiddleware");

// Create Contact Office
router.post("/", contactOfficeController.createContactOffice);

// Get all Contact Offices
router.get("/", contactOfficeController.getContactOffices);

// Get single Contact Office by ID
router.get("/:id", contactOfficeController.getContactOfficeById);

// Update Contact Office (with file upload support)
router.put(
  "/:id",
  authenticate,
  checkPagePermission("contact"),
  (req, res, next) => {
    req.uploadFolder = "contact_office";
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
          let folder = req.uploadFolder || "contact_office";
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
          console.error("[ContactOffice Route] Multer error:", err);
          return res.status(400).json({ message: err.message });
        }
        next();
      });
    } else {
      // For JSON requests, skip multer
      next();
    }
  },
  contactOfficeController.updateContactOffice
);

// Delete Contact Office
router.delete("/:id", contactOfficeController.deleteContactOffice);

module.exports = router;
