const SoftSkillHero = require("../../../models/programs/Entrepreneurship & Incubation/softSkillsTraining/SoftSkillHero");
const SoftSkillTraining = require("../../../models/programs/Entrepreneurship & Incubation/softSkillsTraining/SoftSkillTraining");
const SoftSkillProgram = require("../../../models/programs/Entrepreneurship & Incubation/softSkillsTraining/SoftSkillProgram");
const SoftSkillStat = require("../../../models/programs/Entrepreneurship & Incubation/softSkillsTraining/SoftSkillStat");

// ===== Hero (Soft Skill Training) =====
exports.createHero = async (req, res) => {
  try {
    const { badge, title, description } = req.body;
    const hero = await SoftSkillHero.create({
      badge: badge || "Entrepreneurship & Incubation",
      title: title || "Soft Skills Training",
      description:
        description ||
        "Develop essential interpersonal and professional skills through comprehensive training in communication, teamwork, leadership, and problem-solving. Build the confidence, adaptability, and emotional intelligence needed to collaborate effectively, lead with purpose, and excel in both academic and professional environments.",
    });
    res.status(201).json({
      success: true,
      message: "Soft Skill Training hero created successfully",
      data: hero,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHero = async (req, res) => {
  try {
    const heroes = await SoftSkillHero.findAll({
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
    const hero = await SoftSkillHero.findByPk(id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Soft Skill Training hero not found",
      });
    }

    await hero.update(req.body);
    res.status(200).json({
      success: true,
      message: "Soft Skill Training hero updated successfully",
      data: hero,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteHero = async (req, res) => {
  try {
    const { id } = req.params;
    const hero = await SoftSkillHero.findByPk(id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Soft Skill Training hero not found",
      });
    }

    await hero.destroy();
    res.status(200).json({
      success: true,
      message: "Soft Skill Training hero deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== Soft Skill Training =====
exports.createTraining = async (req, res) => {
  try {
    const training = await SoftSkillTraining.create(req.body);
    res.status(201).json(training);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTrainings = async (_req, res) => {
  try {
    const trainings = await SoftSkillTraining.findAll({
      include: [SoftSkillProgram, SoftSkillStat],
      order: [["createdAt", "DESC"]],
    });
    res.json(trainings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTrainingById = async (req, res) => {
  try {
    const training = await SoftSkillTraining.findByPk(req.params.id, {
      include: [SoftSkillProgram, SoftSkillStat],
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
    const training = await SoftSkillTraining.findByPk(req.params.id);

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
    const training = await SoftSkillTraining.findByPk(req.params.id);

    if (!training) {
      return res.status(404).json({ message: "Training not found" });
    }

    await training.destroy();
    res.json({ message: "Training deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Soft Skill Programs =====
exports.createProgram = async (req, res) => {
  try {
    const imageUrl = req.file ? req.file.path : req.body.image || null;

    const programData = {
      ...req.body,
      image: imageUrl,
    };

    const program = await SoftSkillProgram.create(programData);
    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPrograms = async (_req, res) => {
  try {
    const programs = await SoftSkillProgram.findAll({
      include: [SoftSkillTraining],
      order: [["createdAt", "DESC"]],
    });
    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProgram = async (req, res) => {
  try {
    const program = await SoftSkillProgram.findByPk(req.params.id);

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
    const program = await SoftSkillProgram.findByPk(req.params.id);

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    await program.destroy();
    res.json({ message: "Program deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Soft Skill Statistics =====
exports.createStat = async (req, res) => {
  try {
    const stat = await SoftSkillStat.create(req.body);
    res.status(201).json(stat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStats = async (_req, res) => {
  try {
    const stats = await SoftSkillStat.findAll({
      include: [SoftSkillTraining],
      order: [["createdAt", "DESC"]],
    });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStat = async (req, res) => {
  try {
    const stat = await SoftSkillStat.findByPk(req.params.id);

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
    const stat = await SoftSkillStat.findByPk(req.params.id);

    if (!stat) {
      return res.status(404).json({ message: "Statistic not found" });
    }

    await stat.destroy();
    res.json({ message: "Statistic deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
