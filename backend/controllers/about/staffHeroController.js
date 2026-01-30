const StaffHero = require("../../models/about/staffHeroModel");
const StaffHeroStat = require("../../models/about/staffHeroStatModel");

// ===== Staff Hero =====
exports.createHero = async (req, res) => {
  try {
    const hero = await StaffHero.create(req.body);
    res.status(201).json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHeroes = async (_req, res) => {
  try {
    const heroes = await StaffHero.findAll({
      include: [StaffHeroStat],
      order: [["createdAt", "DESC"]],
    });
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHeroById = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const hero = await StaffHero.findByPk(id, {
      include: [StaffHeroStat],
    });

    if (!hero) {
      return res.status(404).json({ message: "Staff hero not found" });
    }

    res.json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateHero = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const hero = await StaffHero.findByPk(id);

    if (!hero) {
      return res.status(404).json({ message: "Staff hero not found" });
    }

    await hero.update(req.body);
    res.json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteHero = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const hero = await StaffHero.findByPk(id);

    if (!hero) {
      return res.status(404).json({ message: "Staff hero not found" });
    }

    await hero.destroy();
    res.json({ message: "Staff hero deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Staff Hero Stats =====
exports.createStat = async (req, res) => {
  try {
    // Ensure staff_hero_id is an integer if provided
    const statData = { ...req.body };
    if (statData.staff_hero_id) {
      statData.staff_hero_id = parseInt(statData.staff_hero_id, 10);
    }
    const stat = await StaffHeroStat.create(statData);
    res.status(201).json(stat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const findOptions = {
      include: [StaffHero],
      order: [
        ["order", "ASC"],
        ["createdAt", "ASC"],
      ],
    };

    // If staff_hero_id is provided in query, filter by it
    if (req.query.staff_hero_id) {
      findOptions.where = {
        staff_hero_id: parseInt(req.query.staff_hero_id, 10),
      };
    }

    const stats = await StaffHeroStat.findAll(findOptions);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStatById = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const stat = await StaffHeroStat.findByPk(id, {
      include: [StaffHero],
    });

    if (!stat) {
      return res.status(404).json({ message: "Statistic not found" });
    }

    res.json(stat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStat = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const stat = await StaffHeroStat.findByPk(id);

    if (!stat) {
      return res.status(404).json({ message: "Statistic not found" });
    }

    // Ensure staff_hero_id is an integer if provided
    const updateData = { ...req.body };
    if (updateData.staff_hero_id) {
      updateData.staff_hero_id = parseInt(updateData.staff_hero_id, 10);
    }

    await stat.update(updateData);
    res.json(stat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteStat = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const stat = await StaffHeroStat.findByPk(id);

    if (!stat) {
      return res.status(404).json({ message: "Statistic not found" });
    }

    await stat.destroy();
    res.json({ message: "Statistic deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
