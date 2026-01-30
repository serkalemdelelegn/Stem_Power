const UniversityOutreach = require("../../../models/programs/StemCenter/university-outreach/universityOutreach");
const University = require("../../../models/programs/StemCenter/university-outreach/university");
const UniversityOutreachImpactStat = require("../../../models/programs/StemCenter/university-outreach/UniversityOutreachImpactStat");
const UniversityOutreachProgramBenefit = require("../../../models/programs/StemCenter/university-outreach/UniversityOutreachProgramBenefit");
const UniversityOutreachTimeline = require("../../../models/programs/StemCenter/university-outreach/UniversityOutreachTimeline");

// Utility helpers
function parseJSONSafe(value, fallback = null) {
  if (value == null) return fallback;
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (_) {
      return fallback ?? value;
    }
  }
  return value;
}

function toIntOrNull(value) {
  if (value === undefined || value === null || value === "") return null;
  const str = String(value);
  if (/^\d+$/.test(str)) return parseInt(str, 10);
  return null;
}

function coerceUniversityPayload(req) {
  const body = { ...req.body };

  // Normalize fields and map legacy keys
  const payload = {
    name: body.name || body.title || "",
    location: body.location || body.city || body.region || "",
    description: body.description || body.university_details || "",
    studentsServed: body.studentsServed || body.students || null,
    programStartYear:
      body.programStartYear != null
        ? toIntOrNull(body.programStartYear)
        : body.programs
        ? toIntOrNull(String(body.programs).replace("Since ", ""))
        : null,
    established:
      body.established != null
        ? toIntOrNull(body.established)
        : body.establishmentYear
        ? toIntOrNull(String(body.establishmentYear).replace("Est. ", ""))
        : null,
    facilities: parseJSONSafe(
      body.facilities,
      parseJSONSafe(body.key_facilities, [])
    ),
    achievements: parseJSONSafe(
      body.achievements,
      parseJSONSafe(body.notable_achievements, [])
    ),
    image: body.image || null,
  };

  // If a file was uploaded via multer-cloudinary, prefer it
  if (req.file && req.file.path) {
    payload.image = req.file.path;
  }

  return payload;
}

// ===== University Outreach =====
exports.createOutreach = async (req, res) => {
  try {
    const outreach = await UniversityOutreach.create(req.body);
    res.status(201).json(outreach);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOutreach = async (_req, res) => {
  try {
    const outreaches = await UniversityOutreach.findAll({
      include: [{ model: University, as: "universities" }],
      order: [["createdAt", "DESC"]],
    });
    res.json(outreaches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOutreachById = async (req, res) => {
  try {
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const outreach = await UniversityOutreach.findByPk(id, {
      include: [{ model: University, as: "universities" }],
    });

    if (!outreach) {
      return res.status(404).json({ message: "Outreach not found" });
    }

    res.json(outreach);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOutreach = async (req, res) => {
  try {
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const outreach = await UniversityOutreach.findByPk(id);

    if (!outreach) {
      return res.status(404).json({ message: "Outreach not found" });
    }

    await outreach.update(req.body);
    res.json(outreach);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteOutreach = async (req, res) => {
  try {
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const outreach = await UniversityOutreach.findByPk(id);

    if (!outreach) {
      return res.status(404).json({ message: "Outreach not found" });
    }

    await outreach.destroy();
    res.json({ message: "Outreach deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Universities =====
exports.createUniversity = async (req, res) => {
  try {
    const payload = coerceUniversityPayload(req);
    const university = await University.create(payload);
    res.status(201).json(university);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUniversities = async (_req, res) => {
  try {
    const universities = await University.findAll({
      include: [{ model: UniversityOutreach, as: "outreach" }],
      order: [["createdAt", "DESC"]],
    });
    res.json(universities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUniversityById = async (req, res) => {
  try {
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const university = await University.findByPk(id, {
      include: [{ model: UniversityOutreach, as: "outreach" }],
    });

    if (!university) {
      return res.status(404).json({ message: "University not found" });
    }

    res.json(university);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUniversity = async (req, res) => {
  try {
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const university = await University.findByPk(id);

    if (!university) {
      return res.status(404).json({ message: "University not found" });
    }

    const payload = coerceUniversityPayload(req);
    await university.update(payload);
    res.json(university);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUniversity = async (req, res) => {
  try {
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const university = await University.findByPk(id);

    if (!university) {
      return res.status(404).json({ message: "University not found" });
    }

    await university.destroy();
    res.json({ message: "University deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Impact Stats =====
exports.createImpactStat = async (req, res) => {
  try {
    const stat = await UniversityOutreachImpactStat.create(req.body);
    res.status(201).json(stat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getImpactStats = async (_req, res) => {
  try {
    const stats = await UniversityOutreachImpactStat.findAll({
      order: [["createdAt", "ASC"]],
    });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getImpactStatById = async (req, res) => {
  try {
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const stat = await UniversityOutreachImpactStat.findByPk(id);

    if (!stat) {
      return res.status(404).json({ message: "Impact stat not found" });
    }

    res.json(stat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateImpactStat = async (req, res) => {
  try {
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const stat = await UniversityOutreachImpactStat.findByPk(id);

    if (!stat) {
      return res.status(404).json({ message: "Impact stat not found" });
    }

    await stat.update(req.body);
    res.json(stat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteImpactStat = async (req, res) => {
  try {
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const stat = await UniversityOutreachImpactStat.findByPk(id);

    if (!stat) {
      return res.status(404).json({ message: "Impact stat not found" });
    }

    await stat.destroy();
    res.json({ message: "Impact stat deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Program Benefits =====
exports.createProgramBenefit = async (req, res) => {
  try {
    const benefit = await UniversityOutreachProgramBenefit.create(req.body);
    res.status(201).json(benefit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProgramBenefits = async (_req, res) => {
  try {
    const benefits = await UniversityOutreachProgramBenefit.findAll({
      order: [
        ["order", "ASC"],
        ["createdAt", "ASC"],
      ],
    });
    res.json(benefits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProgramBenefitById = async (req, res) => {
  try {
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const benefit = await UniversityOutreachProgramBenefit.findByPk(id);

    if (!benefit) {
      return res.status(404).json({ message: "Program benefit not found" });
    }

    res.json(benefit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProgramBenefit = async (req, res) => {
  try {
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const benefit = await UniversityOutreachProgramBenefit.findByPk(id);

    if (!benefit) {
      return res.status(404).json({ message: "Program benefit not found" });
    }

    await benefit.update(req.body);
    res.json(benefit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProgramBenefit = async (req, res) => {
  try {
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const benefit = await UniversityOutreachProgramBenefit.findByPk(id);

    if (!benefit) {
      return res.status(404).json({ message: "Program benefit not found" });
    }

    await benefit.destroy();
    res.json({ message: "Program benefit deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Timeline =====
exports.createTimeline = async (req, res) => {
  try {
    const timeline = await UniversityOutreachTimeline.create(req.body);
    res.status(201).json(timeline);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTimelines = async (_req, res) => {
  try {
    const timelines = await UniversityOutreachTimeline.findAll({
      order: [
        ["order", "ASC"],
        ["createdAt", "ASC"],
      ],
    });
    res.json(timelines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTimelineById = async (req, res) => {
  try {
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const timeline = await UniversityOutreachTimeline.findByPk(id);

    if (!timeline) {
      return res.status(404).json({ message: "Timeline not found" });
    }

    res.json(timeline);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTimeline = async (req, res) => {
  try {
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const timeline = await UniversityOutreachTimeline.findByPk(id);

    if (!timeline) {
      return res.status(404).json({ message: "Timeline not found" });
    }

    await timeline.update(req.body);
    res.json(timeline);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTimeline = async (req, res) => {
  try {
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const timeline = await UniversityOutreachTimeline.findByPk(id);

    if (!timeline) {
      return res.status(404).json({ message: "Timeline not found" });
    }

    await timeline.destroy();
    res.json({ message: "Timeline deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
