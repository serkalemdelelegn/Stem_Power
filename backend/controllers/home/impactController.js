const ImpactDashboard = require("../../models/home/impactModel");
const ImpactStat = require("../../models/home/impactStatModel");

const normalizeStats = (rawStats) => {
  if (!Array.isArray(rawStats)) return [];
  return rawStats.map((stat, index) => ({
    impact_id: stat.impact_id, // filled later if missing
    metric_key: stat.metric_key ?? `metric_${index + 1}`,
    title: stat.title ?? null,
    description: stat.description ?? null,
    icon: stat.icon ?? null,
    progress: stat.progress ?? 0,
    trend: stat.trend ?? null,
    location: stat.location ?? null,
    value: stat.value ?? null,
    display_value: stat.display_value ?? null,
    is_extra: stat.is_extra ?? false,
    sort_order: stat.sort_order ?? index,
  }));
};

exports.createImpact = async (req, res) => {
  try {
    const impact = await ImpactDashboard.create({
      program_participation: req.body.program_participation ?? 0,
      stem_centers: req.body.stem_centers ?? 0,
      events_held: req.body.events_held ?? 0,
      is_active: req.body.is_active ?? true,
    });

    const statsPayload = normalizeStats(req.body.stats).map((stat) => ({
      ...stat,
      impact_id: impact.id,
    }));

    if (statsPayload.length) {
      await ImpactStat.bulkCreate(statsPayload);
    }

    const createdWithStats = await ImpactDashboard.findByPk(impact.id, {
      include: [{ model: ImpactStat, as: "stats" }],
      order: [
        [{ model: ImpactStat, as: "stats" }, "sort_order", "ASC"],
        [{ model: ImpactStat, as: "stats" }, "id", "ASC"],
      ],
    });

    res.status(201).json(createdWithStats);
  } catch (error) {
    res.status(500).json({
      message: "Error creating Impact Dashboard",
      error: error.message,
    });
  }
};

//Get all Impact dashboard entries

exports.getImpacts = async (req, res) => {
  try {
    const impacts = await ImpactDashboard.findAll({
      include: [{ model: ImpactStat, as: "stats" }],
      order: [
        ["id", "ASC"],
        [{ model: ImpactStat, as: "stats" }, "sort_order", "ASC"],
        [{ model: ImpactStat, as: "stats" }, "id", "ASC"],
      ],
    });
    res.status(200).json(impacts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in fetching Impacts", error: error.message });
  }
};

//Get single Impact dashboard by id

exports.getImpactById = async (req, res) => {
  try {
    const impact = await ImpactDashboard.findByPk(req.params.id, {
      include: [{ model: ImpactStat, as: "stats" }],
      order: [
        [{ model: ImpactStat, as: "stats" }, "sort_order", "ASC"],
        [{ model: ImpactStat, as: "stats" }, "id", "ASC"],
      ],
    });
    if (!impact)
      return res.status(404).json({ message: "Impact entry not found" });
    res.status(200).json(impact);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching impact entry", error: error.message });
  }
};

//update Impact Dashboard

exports.updateImpact = async (req, res) => {
  try {
    const impact = await ImpactDashboard.findByPk(req.params.id);
    if (!impact)
      return res.status(404).json({ message: "Impact entry not found" });
    await impact.update({
      program_participation:
        req.body.program_participation ?? impact.program_participation,
      stem_centers: req.body.stem_centers ?? impact.stem_centers,
      events_held: req.body.events_held ?? impact.events_held,
      is_active: req.body.is_active ?? impact.is_active,
    });

    if (Array.isArray(req.body.stats)) {
      const statsPayload = normalizeStats(req.body.stats).map((stat) => ({
        ...stat,
        impact_id: impact.id,
      }));

      await ImpactStat.destroy({ where: { impact_id: impact.id } });

      if (statsPayload.length) {
        await ImpactStat.bulkCreate(statsPayload);
      }
    }

    const updatedWithStats = await ImpactDashboard.findByPk(impact.id, {
      include: [{ model: ImpactStat, as: "stats" }],
      order: [
        [{ model: ImpactStat, as: "stats" }, "sort_order", "ASC"],
        [{ model: ImpactStat, as: "stats" }, "id", "ASC"],
      ],
    });
    res.status(200).json(updatedWithStats);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating impact entry", error: error.message });
  }
};

exports.deleteImpact = async (req, res) => {
  try {
    const impact = await ImpactDashboard.findByPk(req.params.id);
    if (!impact)
      return res.status(404).json({ message: "Impact entry not found" });
    await impact.destroy();
    res.status(200).json({ message: "Impact entry deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting impact entry", error: error.message });
  }
};
