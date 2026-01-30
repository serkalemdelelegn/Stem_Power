const DigitalSkillHero = require("../../../models/programs/Entrepreneurship & Incubation/digitalSkillTraining/DigitalSkillHero");
const DigitalSkillTraining = require("../../../models/programs/Entrepreneurship & Incubation/digitalSkillTraining/DigitalSkillTraining");
const DigitalSkillProgram = require("../../../models/programs/Entrepreneurship & Incubation/digitalSkillTraining/DigitalSkillProgram");
const DigitalSkillStat = require("../../../models/programs/Entrepreneurship & Incubation/digitalSkillTraining/DigitalSkillStat");

// ===== Hero (Digital Skill Training) =====
exports.createHero = async (req, res) => {
  try {
    const { badge, title, description } = req.body;
    const hero = await DigitalSkillHero.create({
      badge: badge || "Entrepreneurship & Incubation",
      title: title || "Digital Skills Training",
      description:
        description ||
        "Master in-demand digital skills through our transformative partnership with IBM SkillsBuild. Gain hands-on experience in coding, data analysis, robotics, and digital design — empowering you to innovate, solve real-world challenges, and shape the future of technology with confidence",
    });
    res.status(201).json({
      success: true,
      message: "Digital Skill Training hero created successfully",
      data: hero,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHero = async (req, res) => {
  try {
    const heroes = await DigitalSkillHero.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({
      success: true,
      data: heroes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateHero = async (req, res) => {
  try {
    const { id } = req.params;
    const hero = await DigitalSkillHero.findByPk(id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Digital Skill Training hero not found",
      });
    }

    await hero.update(req.body);
    res.status(200).json({
      success: true,
      message: "Digital Skill Training hero updated successfully",
      data: hero,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteHero = async (req, res) => {
  try {
    const { id } = req.params;
    const hero = await DigitalSkillHero.findByPk(id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Digital Skill Training hero not found",
      });
    }

    await hero.destroy();
    res.status(200).json({
      success: true,
      message: "Digital Skill Training hero deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== Digital Skill Training =====
exports.createTraining = async (req, res) => {
  try {
    const training = await DigitalSkillTraining.create(req.body);
    res.status(201).json(training);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTrainings = async (_req, res) => {
  try {
    const trainings = await DigitalSkillTraining.findAll({
      include: [DigitalSkillProgram, DigitalSkillStat],
      order: [["createdAt", "DESC"]],
    });
    res.json(trainings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTrainingById = async (req, res) => {
  try {
    const training = await DigitalSkillTraining.findByPk(req.params.id, {
      include: [DigitalSkillProgram, DigitalSkillStat],
    });

    if (!training) {
      return res.status(404).json({ message: "Training not found" });
    }

    res.json(training);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTraining = async (req, res) => {
  try {
    const training = await DigitalSkillTraining.findByPk(req.params.id);

    if (!training) {
      return res.status(404).json({ message: "Training not found" });
    }

    await training.update(req.body);
    res.json(training);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTraining = async (req, res) => {
  try {
    const training = await DigitalSkillTraining.findByPk(req.params.id);

    if (!training) {
      return res.status(404).json({ message: "Training not found" });
    }

    await training.destroy();
    res.json({ message: "Training deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Digital Skill Programs =====
exports.createProgram = async (req, res) => {
  try {
    const imageUrl = req.file ? req.file.path : req.body.image || null;

    const programData = {
      ...req.body,
      image: imageUrl,
    };

    const program = await DigitalSkillProgram.create(programData);
    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPrograms = async (_req, res) => {
  try {
    const programs = await DigitalSkillProgram.findAll({
      include: [DigitalSkillTraining],
      order: [["createdAt", "DESC"]],
    });
    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProgram = async (req, res) => {
  try {
    const program = await DigitalSkillProgram.findByPk(req.params.id);

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    const updateData = { ...req.body };

    // Use new file if uploaded, otherwise keep existing or use body image
    if (req.file) {
      updateData.image = req.file.path;
    } else if (req.body.image !== undefined) {
      updateData.image = req.body.image || null;
    }

    await program.update(updateData);
    res.json(program);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProgram = async (req, res) => {
  try {
    const program = await DigitalSkillProgram.findByPk(req.params.id);

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    await program.destroy();
    res.json({ message: "Program deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Digital Skill Statistics =====
exports.createStat = async (req, res) => {
  try {
    const stat = await DigitalSkillStat.create(req.body);
    res.status(201).json(stat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStats = async (_req, res) => {
  try {
    const stats = await DigitalSkillStat.findAll({
      include: [DigitalSkillTraining],
      order: [["createdAt", "DESC"]],
    });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStat = async (req, res) => {
  try {
    const stat = await DigitalSkillStat.findByPk(req.params.id);

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
    const stat = await DigitalSkillStat.findByPk(req.params.id);

    if (!stat) {
      return res.status(404).json({ message: "Statistic not found" });
    }

    await stat.destroy();
    res.json({ message: "Statistic deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
