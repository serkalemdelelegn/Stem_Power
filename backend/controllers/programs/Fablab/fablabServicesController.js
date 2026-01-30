const FabLabServiceHero = require("../../../models/programs/FabLab/fablabServices/FabLabServiceHero");
const FabLabService = require("../../../models/programs/FabLab/fablabServices/FabLabService");
const FabLabServiceStat = require("../../../models/programs/FabLab/fablabServices/FabLabServiceStat");
const FabLabServiceFeature = require("../../../models/programs/FabLab/fablabServices/FabLabServiceFeature");
const FabLabServiceApplication = require("../../../models/programs/FabLab/fablabServices/FabLabServiceApplication");
const FabLabServiceBenefit = require("../../../models/programs/FabLab/fablabServices/FabLabServiceBenefit");

// ===== FabLab Service Hero =====
exports.createHero = async (req, res) => {
  try {
    const hero = await FabLabServiceHero.create(req.body);
    res.status(201).json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHeroes = async (_req, res) => {
  try {
    const heroes = await FabLabServiceHero.findAll({
      include: [FabLabServiceStat, FabLabService],
      order: [["createdAt", "DESC"]],
    });
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHeroById = async (req, res) => {
  try {
    const hero = await FabLabServiceHero.findByPk(req.params.id, {
      include: [FabLabServiceStat, FabLabService],
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
    const hero = await FabLabServiceHero.findByPk(req.params.id);

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
    const hero = await FabLabServiceHero.findByPk(req.params.id);

    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }

    await hero.destroy();
    res.json({ message: "Hero deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== FabLab Service Stats =====
exports.createStat = async (req, res) => {
  try {
    const stat = await FabLabServiceStat.create(req.body);
    res.status(201).json(stat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStats = async (_req, res) => {
  try {
    const stats = await FabLabServiceStat.findAll({
      include: [FabLabServiceHero],
      order: [["createdAt", "DESC"]],
    });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStat = async (req, res) => {
  try {
    const stat = await FabLabServiceStat.findByPk(req.params.id);

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
    const stat = await FabLabServiceStat.findByPk(req.params.id);

    if (!stat) {
      return res.status(404).json({ message: "Statistic not found" });
    }

    await stat.destroy();
    res.json({ message: "Statistic deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== FabLab Services =====
exports.createService = async (req, res) => {
  try {
    const imageUrl = req.file ? req.file.path : req.body.image || null;

    // Extract capabilities and applications from body
    let capabilities = req.body.capabilities;
    let applications = req.body.applications;

    // Handle array fields from FormData (multer may parse them differently)
    if (!Array.isArray(capabilities) && capabilities) {
      try {
        capabilities = JSON.parse(capabilities);
      } catch {
        capabilities = [capabilities];
      }
    }
    if (!Array.isArray(applications) && applications) {
      try {
        applications = JSON.parse(applications);
      } catch {
        applications = [applications];
      }
    }

    // Parse specs if it's a string
    let specs = req.body.specs;
    if (typeof specs === "string") {
      try {
        specs = JSON.parse(specs);
      } catch {
        specs = {};
      }
    }

    // Prepare service data
    const servicePayload = {
      title: req.body.title || "",
      description: req.body.description || "",
      image: imageUrl,
      icon: req.body.icon || null,
      capabilities: Array.isArray(capabilities) ? capabilities : [],
      applications: Array.isArray(applications) ? applications : [],
      specs: typeof specs === "object" && !Array.isArray(specs) ? specs : {},
    };

    const service = await FabLabService.create(servicePayload);

    // Fetch the service with all relationships
    const serviceWithRelations = await FabLabService.findByPk(service.id, {
      include: [
        FabLabServiceHero,
        FabLabServiceFeature,
        FabLabServiceApplication,
      ],
    });

    res.status(201).json(serviceWithRelations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getServices = async (_req, res) => {
  try {
    const services = await FabLabService.findAll({
      include: [
        FabLabServiceHero,
        FabLabServiceFeature,
        FabLabServiceApplication,
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await FabLabService.findByPk(req.params.id, {
      include: [
        FabLabServiceHero,
        FabLabServiceFeature,
        FabLabServiceApplication,
      ],
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await FabLabService.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const updateData = {};

    // Handle image
    if (req.file) {
      updateData.image = req.file.path;
    } else if (req.body.image !== undefined) {
      updateData.image = req.body.image || null;
    }

    // Handle other fields
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.description !== undefined)
      updateData.description = req.body.description;
    if (req.body.icon !== undefined) updateData.icon = req.body.icon || null;

    // Handle capabilities
    if (req.body.capabilities !== undefined) {
      let capabilities = req.body.capabilities;
      if (!Array.isArray(capabilities) && capabilities) {
        try {
          capabilities = JSON.parse(capabilities);
        } catch {
          capabilities = [capabilities];
        }
      }
      updateData.capabilities = Array.isArray(capabilities) ? capabilities : [];
    }

    // Handle applications
    if (req.body.applications !== undefined) {
      let applications = req.body.applications;
      if (!Array.isArray(applications) && applications) {
        try {
          applications = JSON.parse(applications);
        } catch {
          applications = [applications];
        }
      }
      updateData.applications = Array.isArray(applications) ? applications : [];
    }

    // Handle specs
    if (req.body.specs !== undefined) {
      let specs = req.body.specs;
      if (typeof specs === "string") {
        try {
          specs = JSON.parse(specs);
        } catch {
          specs = {};
        }
      }
      updateData.specs =
        typeof specs === "object" && !Array.isArray(specs) ? specs : {};
    }

    await service.update(updateData);

    // Fetch the service with all relationships
    const serviceWithRelations = await FabLabService.findByPk(service.id, {
      include: [
        FabLabServiceHero,
        FabLabServiceFeature,
        FabLabServiceApplication,
      ],
    });

    res.json(serviceWithRelations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await FabLabService.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    await service.destroy();
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== FabLab Service Features =====
exports.createFeature = async (req, res) => {
  try {
    const feature = await FabLabServiceFeature.create(req.body);
    res.status(201).json(feature);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFeatures = async (_req, res) => {
  try {
    const features = await FabLabServiceFeature.findAll({
      include: [FabLabService],
      order: [["createdAt", "DESC"]],
    });
    res.json(features);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateFeature = async (req, res) => {
  try {
    const feature = await FabLabServiceFeature.findByPk(req.params.id);

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
    const feature = await FabLabServiceFeature.findByPk(req.params.id);

    if (!feature) {
      return res.status(404).json({ message: "Feature not found" });
    }

    await feature.destroy();
    res.json({ message: "Feature deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== FabLab Service Applications =====
exports.createApplication = async (req, res) => {
  try {
    const application = await FabLabServiceApplication.create(req.body);
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getApplications = async (_req, res) => {
  try {
    const applications = await FabLabServiceApplication.findAll({
      include: [FabLabService],
      order: [["createdAt", "DESC"]],
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const application = await FabLabServiceApplication.findByPk(req.params.id);

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
    const application = await FabLabServiceApplication.findByPk(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    await application.destroy();
    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== FabLab Service Benefits =====
exports.createBenefit = async (req, res) => {
  try {
    const benefit = await FabLabServiceBenefit.create(req.body);
    res.status(201).json(benefit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBenefits = async (_req, res) => {
  try {
    const benefits = await FabLabServiceBenefit.findAll({
      include: [FabLabServiceHero],
      order: [["createdAt", "DESC"]],
    });
    res.json(benefits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBenefitById = async (req, res) => {
  try {
    const benefit = await FabLabServiceBenefit.findByPk(req.params.id, {
      include: [FabLabServiceHero],
    });

    if (!benefit) {
      return res.status(404).json({ message: "Benefit not found" });
    }

    res.json(benefit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBenefit = async (req, res) => {
  try {
    const benefit = await FabLabServiceBenefit.findByPk(req.params.id);

    if (!benefit) {
      return res.status(404).json({ message: "Benefit not found" });
    }

    await benefit.update(req.body);
    res.json(benefit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteBenefit = async (req, res) => {
  try {
    const benefit = await FabLabServiceBenefit.findByPk(req.params.id);

    if (!benefit) {
      return res.status(404).json({ message: "Benefit not found" });
    }

    await benefit.destroy();
    res.json({ message: "Benefit deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Machineries (alias for services with machinery-specific structure) =====
exports.getMachineries = async (_req, res) => {
  try {
    const services = await FabLabService.findAll({
      include: [
        FabLabServiceHero,
        FabLabServiceFeature,
        FabLabServiceApplication,
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
