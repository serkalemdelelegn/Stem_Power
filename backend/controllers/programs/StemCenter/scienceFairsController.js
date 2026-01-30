const ScienceFair = require("../../../models/programs/StemCenter/science-fairs/scienceFair");
const Recognition = require("../../../models/programs/StemCenter/science-fairs/recognition");
const ScienceFairHero = require("../../../models/programs/StemCenter/science-fairs/ScienceFairHero");
const ScienceFairStat = require("../../../models/programs/StemCenter/science-fairs/ScienceFairStat");
const ScienceFairJourneyStage = require("../../../models/programs/StemCenter/science-fairs/ScienceFairJourneyStage");
const ScienceFairWinner = require("../../../models/programs/StemCenter/science-fairs/ScienceFairWinner");

// ===== Hero (Science Fair) =====
exports.createHero = async (req, res) => {
  try {
    const { badge, title, subtitle } = req.body;
    const hero = await ScienceFairHero.create({
      badge: badge || "STEM Operations",
      title: title || "Innovation Meets Opportunity",
      subtitle:
        subtitle ||
        "Across Ethiopia, locally run Science and Engineering Fairs are sparking creativity and innovation among students. From grassroots communities to the national stage, young minds are designing solutions that shape the future.",
    });
    res.status(201).json({
      success: true,
      message: "Science Fair hero created successfully",
      data: hero,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHero = async (req, res) => {
  try {
    const heroes = await ScienceFairHero.findAll({
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
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const hero = await ScienceFairHero.findByPk(id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Science Fair hero not found",
      });
    }

    await hero.update(req.body);
    res.status(200).json({
      success: true,
      message: "Science Fair hero updated successfully",
      data: hero,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteHero = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const hero = await ScienceFairHero.findByPk(id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Science Fair hero not found",
      });
    }

    await hero.destroy();
    res.status(200).json({
      success: true,
      message: "Science Fair hero deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== Statistics (Science Fair) =====
exports.createStat = async (req, res) => {
  try {
    const stat = await ScienceFairStat.create(req.body);
    res.status(201).json(stat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStats = async (_req, res) => {
  try {
    const stats = await ScienceFairStat.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStat = async (req, res) => {
  try {
    const stat = await ScienceFairStat.findByPk(req.params.id);

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
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const stat = await ScienceFairStat.findByPk(id);

    if (!stat) {
      return res.status(404).json({ message: "Statistic not found" });
    }

    await stat.destroy();
    res.json({ message: "Statistic deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Journey Stages (Science Fair) =====
exports.createJourneyStage = async (req, res) => {
  try {
    const stage = await ScienceFairJourneyStage.create(req.body);
    res.status(201).json(stage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getJourneyStages = async (_req, res) => {
  try {
    const stages = await ScienceFairJourneyStage.findAll({
      order: [
        ["order", "ASC"],
        ["createdAt", "DESC"],
      ],
    });
    res.json(stages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateJourneyStage = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const stage = await ScienceFairJourneyStage.findByPk(id);

    if (!stage) {
      return res.status(404).json({ message: "Journey stage not found" });
    }

    await stage.update(req.body);
    res.json(stage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteJourneyStage = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const stage = await ScienceFairJourneyStage.findByPk(id);

    if (!stage) {
      return res.status(404).json({ message: "Journey stage not found" });
    }

    await stage.destroy();
    res.json({ message: "Journey stage deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Winners (Science Fair) =====
exports.createWinner = async (req, res) => {
  try {
    const winnerData = {
      projectTitle: req.body.projectTitle,
      studentName: req.body.studentName,
      university: req.body.university,
      description: req.body.description || null,
      placementBadge: req.body.placementBadge,
      image: req.file ? req.file.path : req.body.image || null,
    };
    const winner = await ScienceFairWinner.create(winnerData);
    res.status(201).json(winner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWinners = async (_req, res) => {
  try {
    const winners = await ScienceFairWinner.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(winners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateWinner = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const winner = await ScienceFairWinner.findByPk(id);

    if (!winner) {
      return res.status(404).json({ message: "Winner not found" });
    }

    const updateData = {
      projectTitle: req.body.projectTitle,
      studentName: req.body.studentName,
      university: req.body.university,
      description: req.body.description || null,
      placementBadge: req.body.placementBadge,
    };

    // Use uploaded file if available, otherwise use existing image or body image
    if (req.file) {
      updateData.image = req.file.path;
    } else if (req.body.image !== undefined) {
      updateData.image = req.body.image || null;
    }

    await winner.update(updateData);
    res.json(winner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteWinner = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const winner = await ScienceFairWinner.findByPk(id);

    if (!winner) {
      return res.status(404).json({ message: "Winner not found" });
    }

    await winner.destroy();
    res.json({ message: "Winner deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Science Fairs =====
exports.createScienceFair = async (req, res) => {
  try {
    const scienceFair = await ScienceFair.create(req.body);
    res.status(201).json(scienceFair);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getScienceFairs = async (_req, res) => {
  try {
    const scienceFairs = await ScienceFair.findAll({
      include: [{ model: Recognition, as: "recognitions" }],
      order: [["createdAt", "DESC"]],
    });
    res.json(scienceFairs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getScienceFairById = async (req, res) => {
  try {
    const scienceFair = await ScienceFair.findByPk(req.params.id, {
      include: [{ model: Recognition, as: "recognitions" }],
    });

    if (!scienceFair) {
      return res.status(404).json({ message: "Science fair not found" });
    }

    res.json(scienceFair);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateScienceFair = async (req, res) => {
  try {
    const scienceFair = await ScienceFair.findByPk(req.params.id);

    if (!scienceFair) {
      return res.status(404).json({ message: "Science fair not found" });
    }

    await scienceFair.update(req.body);
    res.json(scienceFair);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteScienceFair = async (req, res) => {
  try {
    const scienceFair = await ScienceFair.findByPk(req.params.id);

    if (!scienceFair) {
      return res.status(404).json({ message: "Science fair not found" });
    }

    await scienceFair.destroy();
    res.json({ message: "Science fair deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Recognitions =====
exports.createRecognition = async (req, res) => {
  try {
    const recognition = await Recognition.create(req.body);
    res.status(201).json(recognition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecognitions = async (_req, res) => {
  try {
    const recognitions = await Recognition.findAll({
      include: [{ model: ScienceFair, as: "science_fair" }],
      order: [["createdAt", "DESC"]],
    });
    res.json(recognitions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecognitionById = async (req, res) => {
  try {
    const recognition = await Recognition.findByPk(req.params.id, {
      include: [{ model: ScienceFair, as: "science_fair" }],
    });

    if (!recognition) {
      return res.status(404).json({ message: "Recognition not found" });
    }

    res.json(recognition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRecognition = async (req, res) => {
  try {
    const recognition = await Recognition.findByPk(req.params.id);

    if (!recognition) {
      return res.status(404).json({ message: "Recognition not found" });
    }

    await recognition.update(req.body);
    res.json(recognition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRecognition = async (req, res) => {
  try {
    const recognition = await Recognition.findByPk(req.params.id);

    if (!recognition) {
      return res.status(404).json({ message: "Recognition not found" });
    }

    await recognition.destroy();
    res.json({ message: "Recognition deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
