const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = "general_uploads"; // default folder

    if (req.uploadFolder) {
      folder = req.uploadFolder;
    }

    // Generate unique public_id by adding timestamp to prevent duplicates
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const fileName = file.originalname.split(".")[0];
    const uniquePublicId = `${fileName}_${timestamp}_${randomSuffix}`;

    return {
      folder: folder,
      resource_type: "auto",
      public_id: uniquePublicId,
    };
  },
});

const upload = multer({ storage });

module.exports = {
  singleUpload: (fieldName) => (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        // Properly send JSON error instead of [object Object]
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  multipleUpload:
    (fieldName, maxCount = 5) =>
    (req, res, next) => {
      upload.array(fieldName, maxCount)(req, res, (err) => {
        if (err) {
          return res.status(400).json({ message: err.message });
        }
        next();
      });
    },
  fieldsUpload: (fields) => (req, res, next) => {
    upload.fields(fields)(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
};
