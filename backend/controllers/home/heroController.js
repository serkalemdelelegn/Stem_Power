const Hero = require("../../models/home/heroModel");

exports.createHero = async (req, res) => {
  try {
    const imageUrl = req.file ? req.file.path : null;
    if (!imageUrl) {
      return res.status(400).json({ message: "Image is required" });
    }
    const hero = await Hero.create({
      title: req.body.title,
      subtitle: req.body.subtitle,
      description: req.body.description,
      image_url: imageUrl,
      cta: req.body.cta,
      ctaSecondary: req.body.ctaSecondary,
      stat1Label: req.body.stat1Label,
      stat1Value: req.body.stat1Value,
      stat2Label: req.body.stat2Label,
      stat2Value: req.body.stat2Value,
      stat3Label: req.body.stat3Label,
      stat3Value: req.body.stat3Value,
      isActive: req.body.isActive ?? true,
    });
    res.status(201).json(hero);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error Creating Hero", error: error.message });
  }
};

//Get all hero sections
exports.getHeros = async (req, res) => {
  try {
    const heros = await Hero.findAll();
    res.status(200).json(heros);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching heros", error: error.message });
  }
};

// Get single hero by ID

exports.getHeroById = async (req, res) => {
  try {
    const hero = await Hero.findByPk(req.params.id);
    if (!hero) return res.status(400).json({ message: "Hero not found" });
    res.status(200).json(hero);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Hero", error: error.message });
  }
};

//update Hero

exports.updateHero = async (req, res) => {
  try {
    const hero = await Hero.findByPk(req.params.id);
    if (!hero) return res.status(404).json({ message: "Hero not found" });

    const imageUrl = req.file ? req.file.path : hero.image_url; // keep old if no new upload

    await hero.update({
      title: req.body.title ?? hero.title,
      subtitle: req.body.subtitle ?? hero.subtitle,
      description: req.body.description ?? hero.description,
      image_url: imageUrl,
      cta: req.body.cta ?? hero.cta,
      ctaSecondary: req.body.ctaSecondary ?? hero.ctaSecondary,
      stat1Label: req.body.stat1Label ?? hero.stat1Label,
      stat1Value: req.body.stat1Value ?? hero.stat1Value,
      stat2Label: req.body.stat2Label ?? hero.stat2Label,
      stat2Value: req.body.stat2Value ?? hero.stat2Value,
      stat3Label: req.body.stat3Label ?? hero.stat3Label,
      stat3Value: req.body.stat3Value ?? hero.stat3Value,
      isActive: req.body.isActive ?? hero.isActive,
    });

    res.status(200).json(hero);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Hero", error: error.message });
  }
};

//  Delete Hero
exports.deleteHero = async (req, res) => {
  try {
    const hero = await Hero.findByPk(req.params.id);
    if (!hero) return res.status(404).json({ message: "Hero not found" });

    await hero.destroy();
    res.status(200).json({ message: "Hero deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Hero", error: error.message });
  }
};
