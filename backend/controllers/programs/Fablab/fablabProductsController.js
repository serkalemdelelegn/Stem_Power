const FabLabProductHero = require("../../../models/programs/FabLab/fablabProducts/FabLabProductHero");
const FabLabProduct = require("../../../models/programs/FabLab/fablabProducts/FabLabProduct");
const FabLabProductStat = require("../../../models/programs/FabLab/fablabProducts/FabLabProductStat");
const FabLabProductFeature = require("../../../models/programs/FabLab/fablabProducts/FabLabProductFeature");
const FabLabProductApplication = require("../../../models/programs/FabLab/fablabProducts/FabLabProductApplication");

// ===== FabLab Product Hero =====
exports.createHero = async (req, res) => {
  try {
    const hero = await FabLabProductHero.create(req.body);
    res.status(201).json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHeroes = async (_req, res) => {
  try {
    const heroes = await FabLabProductHero.findAll({
      include: [FabLabProductStat, FabLabProduct],
      order: [["createdAt", "DESC"]],
    });
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHeroById = async (req, res) => {
  try {
    const hero = await FabLabProductHero.findByPk(req.params.id, {
      include: [FabLabProductStat, FabLabProduct],
    });

    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }

    res.json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateHero = async (req, res) => {
  try {
    const hero = await FabLabProductHero.findByPk(req.params.id);

    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }

    await hero.update(req.body);
    res.json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteHero = async (req, res) => {
  try {
    const hero = await FabLabProductHero.findByPk(req.params.id);

    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }

    await hero.destroy();
    res.json({ message: "Hero deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== FabLab Product Stats =====
exports.createStat = async (req, res) => {
  try {
    const stat = await FabLabProductStat.create(req.body);
    res.status(201).json(stat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStats = async (_req, res) => {
  try {
    const stats = await FabLabProductStat.findAll({
      include: [FabLabProductHero],
      order: [["createdAt", "DESC"]],
    });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStat = async (req, res) => {
  try {
    const stat = await FabLabProductStat.findByPk(req.params.id);

    if (!stat) {
      return res.status(404).json({ message: "Statistic not found" });
    }

    await stat.update(req.body);
    res.json(stat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteStat = async (req, res) => {
  try {
    const stat = await FabLabProductStat.findByPk(req.params.id);

    if (!stat) {
      return res.status(404).json({ message: "Statistic not found" });
    }

    await stat.destroy();
    res.json({ message: "Statistic deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== FabLab Products =====
exports.createProduct = async (req, res) => {
  try {
    const imageUrl = req.file ? req.file.path : req.body.image || null;

    // Extract features and applications from body (they'll be created separately)
    // When FormData is used, arrays come as keyFeatures[] or keyFeatures
    let keyFeatures = req.body.keyFeatures;
    let features = req.body.features;
    let applications = req.body.applications;
    let whatsIncluded = req.body.whatsIncluded;

    // Handle array fields from FormData (multer may parse them differently)
    if (!Array.isArray(keyFeatures) && keyFeatures) {
      // If it's a string (JSON), try to parse it
      try {
        keyFeatures = JSON.parse(keyFeatures);
      } catch {
        // If not JSON, treat as single value and wrap in array
        keyFeatures = [keyFeatures];
      }
    }
    if (!Array.isArray(applications) && applications) {
      try {
        applications = JSON.parse(applications);
      } catch {
        applications = [applications];
      }
    }
    if (
      !Array.isArray(whatsIncluded) &&
      whatsIncluded &&
      typeof whatsIncluded === "string"
    ) {
      try {
        whatsIncluded = JSON.parse(whatsIncluded);
      } catch {
        // If not JSON, keep as string (will be handled below)
      }
    }

    // Prepare product data - extract only the fields that belong to the product model
    const productPayload = {
      title: req.body.title || req.body.name || "",
      description: req.body.description || "",
      price: req.body.price ? parseFloat(req.body.price) : 0,
      status: req.body.status || "in stock",
      product_overview: req.body.product_overview || null,
      image: imageUrl,
      // Convert whatsIncluded array to JSON string if provided
      whats_included: whatsIncluded
        ? Array.isArray(whatsIncluded)
          ? JSON.stringify(whatsIncluded)
          : typeof whatsIncluded === "string"
          ? whatsIncluded
          : null
        : null,
    };

    const product = await FabLabProduct.create(productPayload);

    // Create features if provided
    const featuresList = keyFeatures || features || [];
    if (Array.isArray(featuresList) && featuresList.length > 0) {
      await Promise.all(
        featuresList.map((feature) =>
          FabLabProductFeature.create({
            productId: product.id,
            feature:
              typeof feature === "string" ? feature : feature.feature || "",
          })
        )
      );
    }

    // Create applications if provided
    if (Array.isArray(applications) && applications.length > 0) {
      await Promise.all(
        applications.map((application) =>
          FabLabProductApplication.create({
            productId: product.id,
            application:
              typeof application === "string"
                ? application
                : application.application || "",
          })
        )
      );
    }

    // Fetch the product with all relationships
    const productWithRelations = await FabLabProduct.findByPk(product.id, {
      include: [
        FabLabProductHero,
        FabLabProductFeature,
        FabLabProductApplication,
      ],
    });

    res.status(201).json(productWithRelations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProducts = async (_req, res) => {
  try {
    const products = await FabLabProduct.findAll({
      include: [
        FabLabProductHero,
        FabLabProductFeature,
        FabLabProductApplication,
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await FabLabProduct.findByPk(req.params.id, {
      include: [
        FabLabProductHero,
        FabLabProductFeature,
        FabLabProductApplication,
      ],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await FabLabProduct.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Extract features and applications from body
    // When FormData is used, arrays come as keyFeatures[] or keyFeatures
    let keyFeatures = req.body.keyFeatures;
    let features = req.body.features;
    let applications = req.body.applications;
    let whatsIncluded = req.body.whatsIncluded;

    // Handle array fields from FormData (multer may parse them differently)
    if (!Array.isArray(keyFeatures) && keyFeatures) {
      try {
        keyFeatures = JSON.parse(keyFeatures);
      } catch {
        keyFeatures = [keyFeatures];
      }
    }
    if (!Array.isArray(applications) && applications) {
      try {
        applications = JSON.parse(applications);
      } catch {
        applications = [applications];
      }
    }
    if (
      !Array.isArray(whatsIncluded) &&
      whatsIncluded &&
      typeof whatsIncluded === "string"
    ) {
      try {
        whatsIncluded = JSON.parse(whatsIncluded);
      } catch {
        // Keep as string
      }
    }

    // Prepare update data - only update fields that are provided
    const updateData = {};
    if (req.body.title !== undefined || req.body.name !== undefined) {
      updateData.title = req.body.title || req.body.name;
    }
    if (req.body.description !== undefined) {
      updateData.description = req.body.description;
    }
    if (req.body.price !== undefined) {
      updateData.price = parseFloat(req.body.price);
    }
    if (req.body.status !== undefined) {
      updateData.status = req.body.status;
    }
    if (req.body.product_overview !== undefined) {
      updateData.product_overview = req.body.product_overview || null;
    }

    // Use new file if uploaded, otherwise keep existing or use body image
    if (req.file) {
      updateData.image = req.file.path;
    } else if (req.body.image !== undefined) {
      updateData.image = req.body.image || null;
    }

    // Convert whatsIncluded array to JSON string if provided
    if (whatsIncluded !== undefined) {
      updateData.whats_included = whatsIncluded
        ? Array.isArray(whatsIncluded)
          ? JSON.stringify(whatsIncluded)
          : typeof whatsIncluded === "string"
          ? whatsIncluded
          : null
        : null;
    }

    await product.update(updateData);

    // Update features if provided
    const featuresList = keyFeatures || features || [];
    if (
      featuresList.length > 0 ||
      keyFeatures !== undefined ||
      features !== undefined
    ) {
      // Delete existing features
      await FabLabProductFeature.destroy({ where: { productId: product.id } });

      // Create new features if provided
      if (Array.isArray(featuresList) && featuresList.length > 0) {
        await Promise.all(
          featuresList.map((feature) =>
            FabLabProductFeature.create({
              productId: product.id,
              feature:
                typeof feature === "string" ? feature : feature.feature || "",
            })
          )
        );
      }
    }

    // Update applications if provided
    if (applications !== undefined) {
      // Delete existing applications
      await FabLabProductApplication.destroy({
        where: { productId: product.id },
      });

      // Create new applications if provided
      if (Array.isArray(applications) && applications.length > 0) {
        await Promise.all(
          applications.map((application) =>
            FabLabProductApplication.create({
              productId: product.id,
              application:
                typeof application === "string"
                  ? application
                  : application.application || "",
            })
          )
        );
      }
    }

    // Fetch the product with all relationships
    const productWithRelations = await FabLabProduct.findByPk(product.id, {
      include: [
        FabLabProductHero,
        FabLabProductFeature,
        FabLabProductApplication,
      ],
    });

    res.json(productWithRelations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await FabLabProduct.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== FabLab Product Features =====
exports.createFeature = async (req, res) => {
  try {
    const feature = await FabLabProductFeature.create(req.body);
    res.status(201).json(feature);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFeatures = async (_req, res) => {
  try {
    const features = await FabLabProductFeature.findAll({
      include: [FabLabProduct],
      order: [["createdAt", "DESC"]],
    });
    res.json(features);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateFeature = async (req, res) => {
  try {
    const feature = await FabLabProductFeature.findByPk(req.params.id);

    if (!feature) {
      return res.status(404).json({ message: "Feature not found" });
    }

    await feature.update(req.body);
    res.json(feature);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFeature = async (req, res) => {
  try {
    const feature = await FabLabProductFeature.findByPk(req.params.id);

    if (!feature) {
      return res.status(404).json({ message: "Feature not found" });
    }

    await feature.destroy();
    res.json({ message: "Feature deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== FabLab Product Applications =====
exports.createApplication = async (req, res) => {
  try {
    const application = await FabLabProductApplication.create(req.body);
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getApplications = async (_req, res) => {
  try {
    const applications = await FabLabProductApplication.findAll({
      include: [FabLabProduct],
      order: [["createdAt", "DESC"]],
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const application = await FabLabProductApplication.findByPk(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    await application.update(req.body);
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const application = await FabLabProductApplication.findByPk(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    await application.destroy();
    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
