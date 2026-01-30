const MakerSpace = require("../../../models/programs/FabLab/makerSpace/MakerSpace");
const MakerSpaceHero = require("../../../models/programs/FabLab/makerSpace/MakerSpaceHero");
const MakerSpaceStat = require("../../../models/programs/FabLab/makerSpace/MakerSpaceStat");
const MakerSpaceGallery = require("../../../models/programs/FabLab/makerSpace/MakerSpaceGallery");
const MakerSpaceWorkshop = require("../../../models/programs/FabLab/makerSpace/MakerSpaceWorkshop");
const MakerSpaceFeature = require("../../../models/programs/FabLab/makerSpace/MakerSpaceFeature");

// ===== Maker Space =====
exports.createMakerSpace = async (req, res) => {
  try {
    const makerSpace = await MakerSpace.create(req.body);
    res.status(201).json(makerSpace);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMakerSpaces = async (_req, res) => {
  try {
    const makerSpaces = await MakerSpace.findAll({
      include: [MakerSpaceStat, MakerSpaceGallery, MakerSpaceWorkshop],
      order: [["createdAt", "DESC"]],
    });
    res.json(makerSpaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMakerSpaceById = async (req, res) => {
  try {
    const makerSpace = await MakerSpace.findByPk(req.params.id, {
      include: [MakerSpaceStat, MakerSpaceGallery, MakerSpaceWorkshop],
    });

    if (!makerSpace) {
      return res.status(404).json({ message: "Maker space not found" });
    }

    res.json(makerSpace);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMakerSpace = async (req, res) => {
  try {
    const makerSpace = await MakerSpace.findByPk(req.params.id);

    if (!makerSpace) {
      return res.status(404).json({ message: "Maker space not found" });
    }

    await makerSpace.update(req.body);
    res.json(makerSpace);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMakerSpace = async (req, res) => {
  try {
    const makerSpace = await MakerSpace.findByPk(req.params.id);

    if (!makerSpace) {
      return res.status(404).json({ message: "Maker space not found" });
    }

    await makerSpace.destroy();
    res.json({ message: "Maker space deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Maker Space Stats =====
exports.createStat = async (req, res) => {
  try {
    const stat = await MakerSpaceStat.create(req.body);
    res.status(201).json(stat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStats = async (_req, res) => {
  try {
    const stats = await MakerSpaceStat.findAll({
      include: [MakerSpace],
      order: [["createdAt", "DESC"]],
    });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStat = async (req, res) => {
  try {
    const stat = await MakerSpaceStat.findByPk(req.params.id);

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
    const stat = await MakerSpaceStat.findByPk(req.params.id);

    if (!stat) {
      return res.status(404).json({ message: "Statistic not found" });
    }

    await stat.destroy();
    res.json({ message: "Statistic deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Maker Space Gallery =====
exports.createGalleryItem = async (req, res) => {
  try {
    const imageUrl = req.file ? req.file.path : req.body.image_url || null;

    const galleryData = {
      image_url: imageUrl,
      caption: req.body.caption || null,
    };

    const galleryItem = await MakerSpaceGallery.create(galleryData);
    res.status(201).json(galleryItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGalleryItems = async (_req, res) => {
  try {
    const galleryItems = await MakerSpaceGallery.findAll({
      include: [MakerSpace],
      order: [["createdAt", "DESC"]],
    });
    res.json(galleryItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateGalleryItem = async (req, res) => {
  try {
    const galleryItem = await MakerSpaceGallery.findByPk(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    const updateData = {};
    if (req.body.caption !== undefined)
      updateData.caption = req.body.caption || null;

    // Use new file if uploaded, otherwise keep existing or use body image_url
    if (req.file) {
      updateData.image_url = req.file.path;
    } else if (req.body.image_url !== undefined) {
      updateData.image_url = req.body.image_url || null;
    }

    await galleryItem.update(updateData);
    res.json(galleryItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteGalleryItem = async (req, res) => {
  try {
    const galleryItem = await MakerSpaceGallery.findByPk(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    await galleryItem.destroy();
    res.json({ message: "Gallery item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Maker Space Workshops =====
exports.createWorkshop = async (req, res) => {
  try {
    const imageUrl = req.file ? req.file.path : req.body.workshop_image || null;

    // Convert date string to ISO if needed
    let dateISO = req.body.date;
    try {
      const parsedDate = new Date(req.body.date);
      if (!isNaN(parsedDate.getTime())) {
        dateISO = parsedDate.toISOString();
      }
    } catch {
      // Keep original if parsing fails
    }

    const workshopData = {
      date: dateISO,
      title: req.body.title,
      level: req.body.level || "beginner",
      duration: req.body.duration || null,
      location: req.body.location || null,
      description: req.body.description || null,
      registration_link: req.body.registration_link || null,
      workshop_image: imageUrl,
    };

    const workshop = await MakerSpaceWorkshop.create(workshopData);
    res.status(201).json(workshop);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWorkshops = async (_req, res) => {
  try {
    const workshops = await MakerSpaceWorkshop.findAll({
      include: [MakerSpace],
      order: [["createdAt", "DESC"]],
    });
    res.json(workshops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateWorkshop = async (req, res) => {
  try {
    const workshop = await MakerSpaceWorkshop.findByPk(req.params.id);

    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    const updateData = {};
    if (req.body.date) {
      try {
        const parsedDate = new Date(req.body.date);
        if (!isNaN(parsedDate.getTime())) {
          updateData.date = parsedDate.toISOString();
        }
      } catch {
        updateData.date = req.body.date;
      }
    }
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.level) updateData.level = req.body.level;
    if (req.body.duration !== undefined)
      updateData.duration = req.body.duration || null;
    if (req.body.location !== undefined)
      updateData.location = req.body.location || null;
    if (req.body.description !== undefined)
      updateData.description = req.body.description || null;
    if (req.body.registration_link !== undefined)
      updateData.registration_link = req.body.registration_link || null;

    // Use new file if uploaded, otherwise keep existing or use body workshop_image
    if (req.file) {
      updateData.workshop_image = req.file.path;
    } else if (req.body.workshop_image !== undefined) {
      updateData.workshop_image = req.body.workshop_image || null;
    }

    await workshop.update(updateData);
    res.json(workshop);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteWorkshop = async (req, res) => {
  try {
    const workshop = await MakerSpaceWorkshop.findByPk(req.params.id);

    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    await workshop.destroy();
    res.json({ message: "Workshop deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Maker Space Hero =====
exports.createHero = async (req, res) => {
  try {
    const imageUrl = req.file ? req.file.path : req.body.image || null;

    const heroData = {
      badge: req.body.badge || "",
      title: req.body.title || "",
      description: req.body.description || null,
      image: imageUrl,
    };

    const hero = await MakerSpaceHero.create(heroData);
    res.status(201).json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHeroes = async (_req, res) => {
  try {
    const heroes = await MakerSpaceHero.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHeroById = async (req, res) => {
  try {
    const hero = await MakerSpaceHero.findByPk(req.params.id);

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
    const hero = await MakerSpaceHero.findByPk(req.params.id);

    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }

    const updateData = {};
    if (req.body.badge !== undefined) updateData.badge = req.body.badge;
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.description !== undefined)
      updateData.description = req.body.description || null;

    // Use new file if uploaded, otherwise keep existing or use body image
    if (req.file) {
      updateData.image = req.file.path;
    } else if (req.body.image !== undefined) {
      updateData.image = req.body.image || null;
    }

    await hero.update(updateData);
    res.json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteHero = async (req, res) => {
  try {
    const hero = await MakerSpaceHero.findByPk(req.params.id);

    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }

    await hero.destroy();
    res.json({ message: "Hero deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Maker Space Features =====
exports.createFeature = async (req, res) => {
  try {
    const imageUrl = req.file ? req.file.path : req.body.image || null;

    const featureData = {
      title: req.body.title,
      description: req.body.description,
      icon: req.body.icon || "sparkles",
      image: imageUrl,
      category: req.body.category || null,
    };

    const feature = await MakerSpaceFeature.create(featureData);
    res.status(201).json(feature);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFeatures = async (_req, res) => {
  try {
    const features = await MakerSpaceFeature.findAll({
      include: [MakerSpace],
      order: [["createdAt", "DESC"]],
    });
    res.json(features);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFeatureById = async (req, res) => {
  try {
    const feature = await MakerSpaceFeature.findByPk(req.params.id, {
      include: [MakerSpace],
    });

    if (!feature) {
      return res.status(404).json({ message: "Feature not found" });
    }

    res.json(feature);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateFeature = async (req, res) => {
  try {
    const feature = await MakerSpaceFeature.findByPk(req.params.id);

    if (!feature) {
      return res.status(404).json({ message: "Feature not found" });
    }

    const updateData = {};
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.icon) updateData.icon = req.body.icon;
    if (req.body.category !== undefined)
      updateData.category = req.body.category || null;

    // Use new file if uploaded, otherwise keep existing or use body image
    if (req.file) {
      updateData.image = req.file.path;
    } else if (req.body.image !== undefined) {
      updateData.image = req.body.image || null;
    }

    await feature.update(updateData);
    res.json(feature);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFeature = async (req, res) => {
  try {
    const feature = await MakerSpaceFeature.findByPk(req.params.id);

    if (!feature) {
      return res.status(404).json({ message: "Feature not found" });
    }

    await feature.destroy();
    res.json({ message: "Feature deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
