const StemCenterHero = require("../../../models/programs/StemCenter/stem-centers/StemCenterHero");
const StemCenter = require("../../../models/programs/StemCenter/stem-centers/StemCenter");
const StemCenterStat = require("../../../models/programs/StemCenter/stem-centers/StemCenterStat");
const StemLaboratory = require("../../../models/programs/StemCenter/stem-centers/StemLaboratory");
// Import junction table to initialize associations
require("../../../models/programs/StemCenter/stem-centers/StemCenterLaboratory");

// ===== Stem Center Hero =====
exports.createHero = async (req, res) => {
  try {
    const hero = await StemCenterHero.create(req.body);
    res.status(201).json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHeroes = async (_req, res) => {
  try {
    const heroes = await StemCenterHero.findAll({
      include: [StemCenterStat, StemCenter],
      order: [["createdAt", "DESC"]],
    });
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHeroById = async (req, res) => {
  try {
    const hero = await StemCenterHero.findByPk(req.params.id, {
      include: [StemCenterStat, StemCenter],
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
    // Convert ID to number if it's a numeric string (Sequelize expects number for integer PKs)
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const hero = await StemCenterHero.findByPk(id);

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
    // Convert ID to number if it's a numeric string (Sequelize expects number for integer PKs)
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const hero = await StemCenterHero.findByPk(id);

    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }

    await hero.destroy();
    res.json({ message: "Hero deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Stem Centers =====
exports.createCenter = async (req, res) => {
  try {
    const imageUrl = req.file ? req.file.path : req.body.image || null;

    // Extract labs from body if provided
    let labs = req.body.labs;
    if (typeof labs === "string") {
      try {
        labs = JSON.parse(labs);
      } catch {
        labs = [];
      }
    }
    if (!Array.isArray(labs)) {
      labs = [];
    }

    // Prepare center data
    const centerPayload = {
      name: req.body.name || "",
      location: req.body.location || "",
      established_date: req.body.established_date || new Date(),
      director_name: req.body.director_name || "",
      funded_by: req.body.funded_by || null,
      website: req.body.website || null,
      phone: req.body.phone || null,
      image: imageUrl,
      is_featured:
        req.body.is_featured === "true" || req.body.is_featured === true,
    };

    const center = await StemCenter.create(centerPayload);

    // Handle labs relationship if provided
    if (labs && labs.length > 0) {
      // Find or create laboratories by name
      const StemLaboratory = require("../../../models/programs/StemCenter/stem-centers/StemLaboratory");
      const labPromises = labs.map(async (labName) => {
        const [lab] = await StemLaboratory.findOrCreate({
          where: { name: labName },
          defaults: { name: labName, description: null },
        });
        return lab;
      });
      const labInstances = await Promise.all(labPromises);
      await center.setStemLaboratories(labInstances);
    }

    // Fetch the center with all relationships
    const centerWithRelations = await StemCenter.findByPk(center.id, {
      include: [StemCenterHero, StemLaboratory],
    });

    res.status(201).json(centerWithRelations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCenters = async (_req, res) => {
  try {
    const centers = await StemCenter.findAll({
      include: [StemCenterHero, StemLaboratory],
      order: [["createdAt", "DESC"]],
    });
    res.json(centers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCenterById = async (req, res) => {
  try {
    const center = await StemCenter.findByPk(req.params.id, {
      include: [StemCenterHero, StemLaboratory],
    });

    if (!center) {
      return res.status(404).json({ message: "Center not found" });
    }

    res.json(center);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCenter = async (req, res) => {
  try {
    // Convert ID to number if it's a numeric string (Sequelize expects number for integer PKs)
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const center = await StemCenter.findByPk(id);

    if (!center) {
      return res.status(404).json({ message: "Center not found" });
    }

    const updateData = {};

    // Handle image
    if (req.file) {
      updateData.image = req.file.path;
    } else if (req.body.image !== undefined) {
      updateData.image = req.body.image || null;
    }

    // Handle other fields
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.location !== undefined)
      updateData.location = req.body.location;
    if (req.body.established_date !== undefined)
      updateData.established_date = req.body.established_date;
    if (req.body.director_name !== undefined)
      updateData.director_name = req.body.director_name;
    if (req.body.funded_by !== undefined)
      updateData.funded_by = req.body.funded_by || null;
    if (req.body.website !== undefined)
      updateData.website = req.body.website || null;
    if (req.body.phone !== undefined) updateData.phone = req.body.phone || null;
    if (req.body.is_featured !== undefined) {
      updateData.is_featured =
        req.body.is_featured === "true" || req.body.is_featured === true;
    }

    await center.update(updateData);

    // Handle labs relationship if provided
    if (req.body.labs !== undefined) {
      let labs = req.body.labs;
      if (typeof labs === "string") {
        try {
          labs = JSON.parse(labs);
        } catch {
          labs = [];
        }
      }
      labs = Array.isArray(labs) ? labs : [];

      if (labs.length > 0) {
        const labPromises = labs.map(async (labName) => {
          const [lab] = await StemLaboratory.findOrCreate({
            where: { name: labName },
            defaults: { name: labName, description: null },
          });
          return lab;
        });
        const labInstances = await Promise.all(labPromises);
        await center.setStemLaboratories(labInstances);
      } else {
        // Clear labs if empty array
        await center.setStemLaboratories([]);
      }
    }

    // Fetch the center with all relationships
    const centerWithRelations = await StemCenter.findByPk(center.id, {
      include: [StemCenterHero, StemLaboratory],
    });

    res.json(centerWithRelations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCenter = async (req, res) => {
  try {
    // Convert ID to number if it's a numeric string (Sequelize expects number for integer PKs)
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const center = await StemCenter.findByPk(id);

    if (!center) {
      return res.status(404).json({ message: "Center not found" });
    }

    await center.destroy();
    res.json({ message: "Center deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Stem Center Stats =====
exports.createCenterStat = async (req, res) => {
  try {
    const stat = await StemCenterStat.create(req.body);
    res.status(201).json(stat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCenterStats = async (_req, res) => {
  try {
    const stats = await StemCenterStat.findAll({
      include: [StemCenterHero],
      order: [["createdAt", "DESC"]],
    });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCenterStat = async (req, res) => {
  try {
    // Convert ID to number if it's a numeric string (Sequelize expects number for integer PKs)
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const stat = await StemCenterStat.findByPk(id);

    if (!stat) {
      return res.status(404).json({ message: "Statistic not found" });
    }

    await stat.update(req.body);
    res.json(stat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCenterStat = async (req, res) => {
  try {
    const stat = await StemCenterStat.findByPk(req.params.id);

    if (!stat) {
      return res.status(404).json({ message: "Statistic not found" });
    }

    await stat.destroy();
    res.json({ message: "Statistic deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Stem Laboratories =====
exports.createLaboratory = async (req, res) => {
  try {
    const laboratory = await StemLaboratory.create(req.body);
    res.status(201).json(laboratory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLaboratories = async (_req, res) => {
  try {
    const laboratories = await StemLaboratory.findAll({
      include: [StemCenter],
      order: [["createdAt", "DESC"]],
    });
    res.json(laboratories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLaboratoryById = async (req, res) => {
  try {
    const laboratory = await StemLaboratory.findByPk(req.params.id, {
      include: [StemCenter],
    });

    if (!laboratory) {
      return res.status(404).json({ message: "Laboratory not found" });
    }

    res.json(laboratory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Laboratory Programs (for specialized programs section) =====
exports.getLaboratoryPrograms = async (_req, res) => {
  try {
    // Use raw query to only select columns that exist
    const sequelize = require("../../../config/db");

    // First, try to get columns that exist in the table
    const [columns] = await sequelize.query(
      "SHOW COLUMNS FROM stem_laboratories LIKE 'code'"
    );
    const hasCodeColumn = columns.length > 0;

    const [iconColumns] = await sequelize.query(
      "SHOW COLUMNS FROM stem_laboratories LIKE 'icon'"
    );
    const hasIconColumn = iconColumns.length > 0;

    // Build attributes array based on what columns exist
    const attributes = ["id", "name", "description"];
    if (hasCodeColumn) attributes.push("code");
    if (hasIconColumn) attributes.push("icon");

    const laboratories = await StemLaboratory.findAll({
      attributes: attributes,
      include: [
        {
          model: StemCenter,
          attributes: ["id", "name"],
          through: { attributes: [] }, // Exclude join table attributes
        },
      ],
      order: [["name", "ASC"]],
    });

    // Transform to frontend format
    const programs = laboratories.map((lab) => {
      // Handle relationship - Sequelize uses plural form by default
      const centers = lab.StemCenters || lab.stemCenters || [];

      // Extract code - use column if exists, otherwise generate from name
      let code = "";
      if (
        hasCodeColumn &&
        lab.code !== undefined &&
        lab.code !== null &&
        lab.code !== ""
      ) {
        code = lab.code;
      } else if (lab.name) {
        // Fallback: use first 4 characters of name as code
        code = lab.name.substring(0, 4).toUpperCase();
      }

      // Extract icon - use column if exists, otherwise use default
      let icon = "🔬";
      if (
        hasIconColumn &&
        lab.icon !== undefined &&
        lab.icon !== null &&
        lab.icon !== ""
      ) {
        icon = lab.icon;
      }

      return {
        id: lab.id.toString(),
        name: lab.name,
        code: code,
        icon: icon,
        stemCenters: Array.isArray(centers)
          ? centers.map((center) => center.id.toString())
          : [],
      };
    });

    res.json(programs);
  } catch (error) {
    console.error("[Laboratory Programs] Error fetching:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.createLaboratoryProgram = async (req, res) => {
  try {
    const { name, code, icon, stemCenters } = req.body;

    // Build data object - only include fields that exist in the model
    const labData = {
      name,
      description: null,
    };

    // Try to add code and icon - Sequelize will ignore if columns don't exist
    // We'll catch any errors and handle gracefully
    if (code !== undefined && code !== null && code !== "") {
      labData.code = code;
    }
    if (icon !== undefined && icon !== null && icon !== "") {
      labData.icon = icon;
    }

    // Check if columns exist before trying to use them
    const sequelize = require("../../../config/db");
    const [codeColumns] = await sequelize.query(
      "SHOW COLUMNS FROM stem_laboratories LIKE 'code'"
    );
    const [iconColumns] = await sequelize.query(
      "SHOW COLUMNS FROM stem_laboratories LIKE 'icon'"
    );

    // Remove code/icon from labData if columns don't exist
    if (codeColumns.length === 0 && labData.code) {
      delete labData.code;
    }
    if (iconColumns.length === 0 && labData.icon) {
      delete labData.icon;
    }

    const laboratory = await StemLaboratory.create(labData);

    // Associate with stem centers if provided
    if (stemCenters && Array.isArray(stemCenters) && stemCenters.length > 0) {
      const centerIds = stemCenters
        .map((id) => parseInt(id, 10))
        .filter((id) => !isNaN(id));
      if (centerIds.length > 0) {
        const centers = await StemCenter.findAll({
          where: { id: centerIds },
        });
        await laboratory.setStemCenters(centers);
      }
    }

    // Fetch with relationships - only select columns that exist
    const attributes = ["id", "name", "description"];
    if (codeColumns.length > 0) attributes.push("code");
    if (iconColumns.length > 0) attributes.push("icon");

    const labWithCenters = await StemLaboratory.findByPk(laboratory.id, {
      attributes: attributes,
      include: [
        {
          model: StemCenter,
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
      ],
    });

    // Handle relationship - Sequelize uses plural form by default
    const centers =
      labWithCenters.StemCenters || labWithCenters.stemCenters || [];

    // Extract code and icon with fallbacks
    let finalCode = "";
    if (codeColumns.length > 0 && labWithCenters.code) {
      finalCode = labWithCenters.code;
    } else if (labWithCenters.name) {
      finalCode = labWithCenters.name.substring(0, 4).toUpperCase();
    }

    let finalIcon = "🔬";
    if (iconColumns.length > 0 && labWithCenters.icon) {
      finalIcon = labWithCenters.icon;
    }

    res.status(201).json({
      id: labWithCenters.id.toString(),
      name: labWithCenters.name,
      code: finalCode,
      icon: finalIcon,
      stemCenters: Array.isArray(centers)
        ? centers.map((center) => center.id.toString())
        : [],
    });
  } catch (error) {
    console.error("[Laboratory Programs] Error creating:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateLaboratoryProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, icon, stemCenters } = req.body;

    const laboratory = await StemLaboratory.findByPk(id);
    if (!laboratory) {
      return res.status(404).json({ message: "Laboratory program not found" });
    }

    // Check if columns exist before trying to update them
    const sequelize = require("../../../config/db");
    const [codeColumns] = await sequelize.query(
      "SHOW COLUMNS FROM stem_laboratories LIKE 'code'"
    );
    const [iconColumns] = await sequelize.query(
      "SHOW COLUMNS FROM stem_laboratories LIKE 'icon'"
    );

    // Update basic fields
    const updateData = {
      name: name !== undefined ? name : laboratory.name,
    };

    // Only add code/icon if columns exist
    if (
      codeColumns.length > 0 &&
      code !== undefined &&
      code !== null &&
      code !== ""
    ) {
      updateData.code = code;
    }
    if (
      iconColumns.length > 0 &&
      icon !== undefined &&
      icon !== null &&
      icon !== ""
    ) {
      updateData.icon = icon;
    }

    await laboratory.update(updateData);

    // Update stem centers association if provided
    if (stemCenters !== undefined) {
      if (Array.isArray(stemCenters) && stemCenters.length > 0) {
        const centerIds = stemCenters
          .map((id) => parseInt(id, 10))
          .filter((id) => !isNaN(id));
        if (centerIds.length > 0) {
          const centers = await StemCenter.findAll({
            where: { id: centerIds },
          });
          await laboratory.setStemCenters(centers);
        } else {
          await laboratory.setStemCenters([]);
        }
      } else {
        await laboratory.setStemCenters([]);
      }
    }

    // Fetch with relationships - only select columns that exist
    const attributes = ["id", "name", "description"];
    if (codeColumns.length > 0) attributes.push("code");
    if (iconColumns.length > 0) attributes.push("icon");

    const labWithCenters = await StemLaboratory.findByPk(laboratory.id, {
      attributes: attributes,
      include: [
        {
          model: StemCenter,
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
      ],
    });

    // Handle relationship - Sequelize uses plural form by default
    const centers =
      labWithCenters.StemCenters || labWithCenters.stemCenters || [];

    // Extract code and icon with fallbacks
    let finalCode = "";
    if (codeColumns.length > 0 && labWithCenters.code) {
      finalCode = labWithCenters.code;
    } else if (labWithCenters.name) {
      finalCode = labWithCenters.name.substring(0, 4).toUpperCase();
    }

    let finalIcon = "🔬";
    if (iconColumns.length > 0 && labWithCenters.icon) {
      finalIcon = labWithCenters.icon;
    }

    res.json({
      id: labWithCenters.id.toString(),
      name: labWithCenters.name,
      code: finalCode,
      icon: finalIcon,
      stemCenters: Array.isArray(centers)
        ? centers.map((center) => center.id.toString())
        : [],
    });
  } catch (error) {
    console.error("[Laboratory Programs] Error updating:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteLaboratoryProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const laboratory = await StemLaboratory.findByPk(id);

    if (!laboratory) {
      return res.status(404).json({ message: "Laboratory program not found" });
    }

    await laboratory.destroy();
    res.json({ message: "Laboratory program deleted successfully" });
  } catch (error) {
    console.error("[Laboratory Programs] Error deleting:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateLaboratory = async (req, res) => {
  try {
    const laboratory = await StemLaboratory.findByPk(req.params.id);

    if (!laboratory) {
      return res.status(404).json({ message: "Laboratory not found" });
    }

    await laboratory.update(req.body);
    res.json(laboratory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteLaboratory = async (req, res) => {
  try {
    const laboratory = await StemLaboratory.findByPk(req.params.id);

    if (!laboratory) {
      return res.status(404).json({ message: "Laboratory not found" });
    }

    await laboratory.destroy();
    res.json({ message: "Laboratory deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
