const express = require("express");
const router = express.Router();
const fablabProductsController = require("../../../controllers/programs/Fablab/fablabProductsController");
const { singleUpload } = require("../../../middlewares/upload");
const { authenticate } = require("../../../middlewares/authMiddleware");

// ===== Hero =====
router.post("/hero", authenticate, fablabProductsController.createHero);
router.get("/hero", fablabProductsController.getHeroes);
router.get("/hero/:id", fablabProductsController.getHeroById);
router.put("/hero/:id", authenticate, fablabProductsController.updateHero);
router.delete("/hero/:id", authenticate, fablabProductsController.deleteHero);

// ===== Stats =====
router.post("/stats", authenticate, fablabProductsController.createStat);
router.get("/stats", fablabProductsController.getStats);
router.put("/stats/:id", authenticate, fablabProductsController.updateStat);
router.delete("/stats/:id", authenticate, fablabProductsController.deleteStat);

// ===== Products =====
router.post(
  "/products",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "fablab_products"; // Cloudinary folder
    next();
  },
  singleUpload("file"), // frontend must send "file"
  fablabProductsController.createProduct
);
router.get("/products", fablabProductsController.getProducts);
router.get("/products/:id", fablabProductsController.getProductById);
router.put(
  "/products/:id",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "fablab_products"; // Cloudinary folder
    next();
  },
  singleUpload("file"), // frontend must send "file"
  fablabProductsController.updateProduct
);
router.delete(
  "/products/:id",
  authenticate,
  fablabProductsController.deleteProduct
);

// ===== Features =====
router.post("/features", authenticate, fablabProductsController.createFeature);
router.get("/features", fablabProductsController.getFeatures);
router.put(
  "/features/:id",
  authenticate,
  fablabProductsController.updateFeature
);
router.delete(
  "/features/:id",
  authenticate,
  fablabProductsController.deleteFeature
);

// ===== Applications =====
router.post(
  "/applications",
  authenticate,
  fablabProductsController.createApplication
);
router.get("/applications", fablabProductsController.getApplications);
router.put(
  "/applications/:id",
  authenticate,
  fablabProductsController.updateApplication
);
router.delete(
  "/applications/:id",
  authenticate,
  fablabProductsController.deleteApplication
);

module.exports = router;
