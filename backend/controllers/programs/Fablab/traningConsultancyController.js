const TrainingConsultancy = require("../../../models/programs/FabLab/trainingConsultancy/TrainingConsultancy");
const TrainingConsultancyStat = require("../../../models/programs/FabLab/trainingConsultancy/TrainingConsultancyStat");
const TrainingConsultancyPercentageStat = require("../../../models/programs/FabLab/trainingConsultancy/TrainingConsultancyPercentageStat");
const TrainingConsultancyPage = require("../../../models/programs/FabLab/trainingConsultancy/TrainingConsultancyPage");
const TrainingConsultancyPageStat = require("../../../models/programs/FabLab/trainingConsultancy/TrainingConsultancyPageStat");
const TrainingConsultancyHero = require("../../../models/programs/FabLab/trainingConsultancy/TrainingConsultancyHero");
const TrainingProgram = require("../../../models/programs/FabLab/trainingConsultancy/TrainingProgram");
const TrainingConsultancyPartner = require("../../../models/programs/FabLab/trainingConsultancy/TrainingConsultancyPartner");
const TrainingConsultancyPartnersSection = require("../../../models/programs/FabLab/trainingConsultancy/TrainingConsultancyPartnersSection");
const SuccessMetric = require("../../../models/programs/FabLab/trainingConsultancy/SuccessMetric");
const ConsultancyService = require("../../../models/programs/FabLab/trainingConsultancy/ConsultancyService");
const PartnershipType = require("../../../models/programs/FabLab/trainingConsultancy/PartnershipType");

// ===== Training Consultancy =====
exports.createConsultancy = async (req, res) => {
  try {
    const consultancy = await TrainingConsultancy.create(req.body);
    res.status(201).json(consultancy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getConsultancies = async (_req, res) => {
  try {
    const consultancies = await TrainingConsultancy.findAll({
      include: [
        TrainingConsultancyStat,
        TrainingConsultancyPercentageStat,
        {
          model: TrainingConsultancyPage,
          include: [TrainingConsultancyPageStat],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(consultancies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getConsultancyById = async (req, res) => {
  try {
    const consultancy = await TrainingConsultancy.findByPk(req.params.id, {
      include: [
        TrainingConsultancyStat,
        TrainingConsultancyPercentageStat,
        {
          model: TrainingConsultancyPage,
          include: [TrainingConsultancyPageStat],
        },
      ],
    });

    if (!consultancy) {
      return res.status(404).json({ message: "Consultancy not found" });
    }

    res.json(consultancy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateConsultancy = async (req, res) => {
  try {
    const consultancy = await TrainingConsultancy.findByPk(req.params.id);

    if (!consultancy) {
      return res.status(404).json({ message: "Consultancy not found" });
    }

    await consultancy.update(req.body);
    res.json(consultancy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteConsultancy = async (req, res) => {
  try {
    const consultancy = await TrainingConsultancy.findByPk(req.params.id);

    if (!consultancy) {
      return res.status(404).json({ message: "Consultancy not found" });
    }

    await consultancy.destroy();
    res.json({ message: "Consultancy deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Training Consultancy Stats =====
exports.createConsultancyStat = async (req, res) => {
  try {
    const stat = await TrainingConsultancyStat.create(req.body);
    res.status(201).json(stat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getConsultancyStats = async (_req, res) => {
  try {
    const stats = await TrainingConsultancyStat.findAll({
      include: [TrainingConsultancy],
      order: [["createdAt", "DESC"]],
    });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateConsultancyStat = async (req, res) => {
  try {
    // Convert ID to number if it's a numeric string (Sequelize expects number for integer PKs)
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const stat = await TrainingConsultancyStat.findByPk(id);

    if (!stat) {
      return res.status(404).json({ message: "Statistic not found" });
    }

    await stat.update(req.body);
    res.json(stat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteConsultancyStat = async (req, res) => {
  try {
    // Convert ID to number if it's a numeric string (Sequelize expects number for integer PKs)
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const stat = await TrainingConsultancyStat.findByPk(id);

    if (!stat) {
      return res.status(404).json({ message: "Statistic not found" });
    }

    await stat.destroy();
    res.json({ message: "Statistic deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Training Consultancy Percentage Stats =====
exports.createPercentageStat = async (req, res) => {
  try {
    const percentageStat = await TrainingConsultancyPercentageStat.create(
      req.body
    );
    res.status(201).json(percentageStat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPercentageStats = async (_req, res) => {
  try {
    const percentageStats = await TrainingConsultancyPercentageStat.findAll({
      include: [TrainingConsultancy],
      order: [["createdAt", "DESC"]],
    });
    res.json(percentageStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePercentageStat = async (req, res) => {
  try {
    const percentageStat = await TrainingConsultancyPercentageStat.findByPk(
      req.params.id
    );

    if (!percentageStat) {
      return res
        .status(404)
        .json({ message: "Percentage statistic not found" });
    }

    await percentageStat.update(req.body);
    res.json(percentageStat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePercentageStat = async (req, res) => {
  try {
    const percentageStat = await TrainingConsultancyPercentageStat.findByPk(
      req.params.id
    );

    if (!percentageStat) {
      return res
        .status(404)
        .json({ message: "Percentage statistic not found" });
    }

    await percentageStat.destroy();
    res.json({ message: "Percentage statistic deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Training Consultancy Pages =====
exports.createPage = async (req, res) => {
  try {
    const page = await TrainingConsultancyPage.create(req.body);
    res.status(201).json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPages = async (_req, res) => {
  try {
    const pages = await TrainingConsultancyPage.findAll({
      include: [TrainingConsultancy, TrainingConsultancyPageStat],
      order: [["createdAt", "DESC"]],
    });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPageById = async (req, res) => {
  try {
    const page = await TrainingConsultancyPage.findByPk(req.params.id, {
      include: [TrainingConsultancy, TrainingConsultancyPageStat],
    });

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePage = async (req, res) => {
  try {
    const page = await TrainingConsultancyPage.findByPk(req.params.id);

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    await page.update(req.body);
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePage = async (req, res) => {
  try {
    const page = await TrainingConsultancyPage.findByPk(req.params.id);

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    await page.destroy();
    res.json({ message: "Page deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Training Consultancy Page Stats =====
exports.createPageStat = async (req, res) => {
  try {
    const pageStat = await TrainingConsultancyPageStat.create(req.body);
    res.status(201).json(pageStat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPageStats = async (_req, res) => {
  try {
    const pageStats = await TrainingConsultancyPageStat.findAll({
      include: [TrainingConsultancyPage],
      order: [["createdAt", "DESC"]],
    });
    res.json(pageStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePageStat = async (req, res) => {
  try {
    const pageStat = await TrainingConsultancyPageStat.findByPk(req.params.id);

    if (!pageStat) {
      return res.status(404).json({ message: "Page statistic not found" });
    }

    await pageStat.update(req.body);
    res.json(pageStat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePageStat = async (req, res) => {
  try {
    const pageStat = await TrainingConsultancyPageStat.findByPk(req.params.id);

    if (!pageStat) {
      return res.status(404).json({ message: "Page statistic not found" });
    }

    await pageStat.destroy();
    res.json({ message: "Page statistic deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Training Consultancy Hero =====
exports.createHero = async (req, res) => {
  try {
    const hero = await TrainingConsultancyHero.create(req.body);
    res.status(201).json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHeroes = async (_req, res) => {
  try {
    const heroes = await TrainingConsultancyHero.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHeroById = async (req, res) => {
  try {
    const hero = await TrainingConsultancyHero.findByPk(req.params.id);

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
    const hero = await TrainingConsultancyHero.findByPk(req.params.id);

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
    const hero = await TrainingConsultancyHero.findByPk(req.params.id);

    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }

    await hero.destroy();
    res.json({ message: "Hero deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Training Programs =====
exports.createTrainingProgram = async (req, res) => {
  try {
    const imageUrl = req.file ? req.file.path : req.body.image || null;

    // Extract features and outcomes from body
    let features = req.body.features;
    let outcomes = req.body.outcomes;

    // Handle array fields from FormData (multer may parse them differently)
    if (!Array.isArray(features) && features) {
      try {
        features = JSON.parse(features);
      } catch {
        features = [features];
      }
    }
    if (!Array.isArray(outcomes) && outcomes) {
      try {
        outcomes = JSON.parse(outcomes);
      } catch {
        outcomes = [outcomes];
      }
    }

    // Prepare program data
    const programPayload = {
      title: req.body.title || "",
      description: req.body.description || "",
      icon: req.body.icon || "graduationcap",
      image: imageUrl,
      features: Array.isArray(features) ? features : [],
      outcomes: Array.isArray(outcomes) ? outcomes : [],
    };

    const program = await TrainingProgram.create(programPayload);
    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTrainingPrograms = async (_req, res) => {
  try {
    const programs = await TrainingProgram.findAll({
      include: [TrainingConsultancy],
      order: [["createdAt", "DESC"]],
    });
    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTrainingProgramById = async (req, res) => {
  try {
    const program = await TrainingProgram.findByPk(req.params.id, {
      include: [TrainingConsultancy],
    });

    if (!program) {
      return res.status(404).json({ message: "Training program not found" });
    }

    res.json(program);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTrainingProgram = async (req, res) => {
  try {
    // Convert ID to number if it's a numeric string (Sequelize expects number for integer PKs)
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const program = await TrainingProgram.findByPk(id);

    if (!program) {
      return res.status(404).json({ message: "Training program not found" });
    }

    await program.update(req.body);
    res.json(program);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTrainingProgram = async (req, res) => {
  try {
    // Convert ID to number if it's a numeric string (Sequelize expects number for integer PKs)
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const program = await TrainingProgram.findByPk(id);

    if (!program) {
      return res.status(404).json({ message: "Training program not found" });
    }

    await program.destroy();
    res.json({ message: "Training program deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Training Consultancy Partners =====
exports.createPartner = async (req, res) => {
  try {
    const logoUrl = req.file ? req.file.path : req.body.logo || null;

    const partnerPayload = {
      name: req.body.name || "",
      logo: logoUrl,
    };

    const partner = await TrainingConsultancyPartner.create(partnerPayload);
    res.status(201).json(partner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPartners = async (_req, res) => {
  try {
    const partners = await TrainingConsultancyPartner.findAll({
      include: [TrainingConsultancy],
      order: [["createdAt", "DESC"]],
    });
    res.json(partners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPartnerById = async (req, res) => {
  try {
    const partner = await TrainingConsultancyPartner.findByPk(req.params.id, {
      include: [TrainingConsultancy],
    });

    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    res.json(partner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePartner = async (req, res) => {
  try {
    // Convert ID to number if it's a numeric string (Sequelize expects number for integer PKs)
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const partner = await TrainingConsultancyPartner.findByPk(id);

    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    const updateData = {};

    // Handle logo
    if (req.file) {
      updateData.logo = req.file.path;
    } else if (req.body.logo !== undefined) {
      updateData.logo = req.body.logo || null;
    }

    // Handle name
    if (req.body.name !== undefined) updateData.name = req.body.name;

    await partner.update(updateData);
    res.json(partner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePartner = async (req, res) => {
  try {
    // Convert ID to number if it's a numeric string (Sequelize expects number for integer PKs)
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const partner = await TrainingConsultancyPartner.findByPk(id);

    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    await partner.destroy();
    res.json({ message: "Partner deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Training Consultancy Partners Section =====
exports.createPartnersSection = async (req, res) => {
  try {
    const section = await TrainingConsultancyPartnersSection.create(req.body);
    res.status(201).json(section);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPartnersSections = async (_req, res) => {
  try {
    const sections = await TrainingConsultancyPartnersSection.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPartnersSectionById = async (req, res) => {
  try {
    const section = await TrainingConsultancyPartnersSection.findByPk(
      req.params.id
    );

    if (!section) {
      return res.status(404).json({ message: "Partners section not found" });
    }

    res.json(section);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePartnersSection = async (req, res) => {
  try {
    const section = await TrainingConsultancyPartnersSection.findByPk(
      req.params.id
    );

    if (!section) {
      return res.status(404).json({ message: "Partners section not found" });
    }

    await section.update(req.body);
    res.json(section);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePartnersSection = async (req, res) => {
  try {
    const section = await TrainingConsultancyPartnersSection.findByPk(
      req.params.id
    );

    if (!section) {
      return res.status(404).json({ message: "Partners section not found" });
    }

    await section.destroy();
    res.json({ message: "Partners section deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Success Metrics =====
exports.createSuccessMetric = async (req, res) => {
  try {
    const metric = await SuccessMetric.create(req.body);
    res.status(201).json(metric);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSuccessMetrics = async (_req, res) => {
  try {
    const metrics = await SuccessMetric.findAll({
      include: [TrainingConsultancy],
      order: [["createdAt", "DESC"]],
    });
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSuccessMetricById = async (req, res) => {
  try {
    const metric = await SuccessMetric.findByPk(req.params.id, {
      include: [TrainingConsultancy],
    });

    if (!metric) {
      return res.status(404).json({ message: "Success metric not found" });
    }

    res.json(metric);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSuccessMetric = async (req, res) => {
  try {
    const metric = await SuccessMetric.findByPk(req.params.id);

    if (!metric) {
      return res.status(404).json({ message: "Success metric not found" });
    }

    await metric.update(req.body);
    res.json(metric);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSuccessMetric = async (req, res) => {
  try {
    const metric = await SuccessMetric.findByPk(req.params.id);

    if (!metric) {
      return res.status(404).json({ message: "Success metric not found" });
    }

    await metric.destroy();
    res.json({ message: "Success metric deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Consultancy Services =====
exports.createConsultancyService = async (req, res) => {
  try {
    const service = await ConsultancyService.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getConsultancyServices = async (_req, res) => {
  try {
    const services = await ConsultancyService.findAll({
      include: [TrainingConsultancy],
      order: [["createdAt", "DESC"]],
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getConsultancyServiceById = async (req, res) => {
  try {
    const service = await ConsultancyService.findByPk(req.params.id, {
      include: [TrainingConsultancy],
    });

    if (!service) {
      return res.status(404).json({ message: "Consultancy service not found" });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateConsultancyService = async (req, res) => {
  try {
    const service = await ConsultancyService.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Consultancy service not found" });
    }

    await service.update(req.body);
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteConsultancyService = async (req, res) => {
  try {
    const service = await ConsultancyService.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Consultancy service not found" });
    }

    await service.destroy();
    res.json({ message: "Consultancy service deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Partnership Types =====
exports.createPartnershipType = async (req, res) => {
  try {
    const partnershipType = await PartnershipType.create(req.body);
    res.status(201).json(partnershipType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPartnershipTypes = async (_req, res) => {
  try {
    const partnershipTypes = await PartnershipType.findAll({
      include: [TrainingConsultancy],
      order: [["createdAt", "DESC"]],
    });
    res.json(partnershipTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPartnershipTypeById = async (req, res) => {
  try {
    const partnershipType = await PartnershipType.findByPk(req.params.id, {
      include: [TrainingConsultancy],
    });

    if (!partnershipType) {
      return res.status(404).json({ message: "Partnership type not found" });
    }

    res.json(partnershipType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePartnershipType = async (req, res) => {
  try {
    const partnershipType = await PartnershipType.findByPk(req.params.id);

    if (!partnershipType) {
      return res.status(404).json({ message: "Partnership type not found" });
    }

    await partnershipType.update(req.body);
    res.json(partnershipType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePartnershipType = async (req, res) => {
  try {
    const partnershipType = await PartnershipType.findByPk(req.params.id);

    if (!partnershipType) {
      return res.status(404).json({ message: "Partnership type not found" });
    }

    await partnershipType.destroy();
    res.json({ message: "Partnership type deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
