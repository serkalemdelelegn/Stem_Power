const IncubationHero = require("../../../models/programs/Entrepreneurship & Incubation/incubationProgram/IncubationHero");
const IncubationProgram = require("../../../models/programs/Entrepreneurship & Incubation/incubationProgram/IncubationProgram");
const IncubationCourse = require("../../../models/programs/Entrepreneurship & Incubation/incubationProgram/IncubationCourse");
const IncubationStat = require("../../../models/programs/Entrepreneurship & Incubation/incubationProgram/IncubationStat");
const IncubationSuccessStory = require("../../../models/programs/Entrepreneurship & Incubation/incubationProgram/IncubationSuccessStory");

// ===== Hero (Incubation Program) =====
exports.createHero = async (req, res) => {
  try {
    const { badge, title, description } = req.body;
    const hero = await IncubationHero.create({
      badge: badge || "Entrepreneurship & Incubation",
      title: title || "Incubation Program",
      description:
        description ||
        "Transform your innovative ideas into successful, sustainable ventures with comprehensive support, mentorship, and resources.",
    });
    res.status(201).json({
      success: true,
      message: "Incubation Program hero created successfully",
      data: hero,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHero = async (req, res) => {
  try {
    const heroes = await IncubationHero.findAll({
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
    const hero = await IncubationHero.findByPk(id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Incubation Program hero not found",
      });
    }

    await hero.update(req.body);
    res.status(200).json({
      success: true,
      message: "Incubation Program hero updated successfully",
      data: hero,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteHero = async (req, res) => {
  try {
    const { id } = req.params;
    const hero = await IncubationHero.findByPk(id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Incubation Program hero not found",
      });
    }

    await hero.destroy();
    res.status(200).json({
      success: true,
      message: "Incubation Program hero deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== Incubation Program =====
exports.createProgram = async (req, res) => {
  try {
    const program = await IncubationProgram.create(req.body);
    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPrograms = async (_req, res) => {
  try {
    const programs = await IncubationProgram.findAll({
      include: [IncubationCourse, IncubationStat, IncubationSuccessStory],
      order: [["createdAt", "DESC"]],
    });
    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProgramById = async (req, res) => {
  try {
    const program = await IncubationProgram.findByPk(req.params.id, {
      include: [IncubationCourse, IncubationStat, IncubationSuccessStory],
    });

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    res.json(program);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProgram = async (req, res) => {
  try {
    const program = await IncubationProgram.findByPk(req.params.id);

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    await program.update(req.body);
    res.json(program);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProgram = async (req, res) => {
  try {
    const program = await IncubationProgram.findByPk(req.params.id);

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    await program.destroy();
    res.json({ message: "Program deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Incubation Courses =====
exports.createCourse = async (req, res) => {
  try {
    const imageUrl = req.file ? req.file.path : req.body.image || null;

    const courseData = {
      ...req.body,
      image: imageUrl,
    };

    const course = await IncubationCourse.create(courseData);
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCourses = async (_req, res) => {
  try {
    const courses = await IncubationCourse.findAll({
      include: [IncubationProgram],
      order: [["createdAt", "DESC"]],
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await IncubationCourse.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const updateData = { ...req.body };

    // Use new file if uploaded, otherwise keep existing or use body image
    if (req.file) {
      updateData.image = req.file.path;
    } else if (req.body.image !== undefined) {
      updateData.image = req.body.image || null;
    }

    await course.update(updateData);
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await IncubationCourse.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await course.destroy();
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Incubation Statistics =====
exports.createStat = async (req, res) => {
  try {
    const stat = await IncubationStat.create(req.body);
    res.status(201).json(stat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStats = async (_req, res) => {
  try {
    const stats = await IncubationStat.findAll({
      include: [IncubationProgram],
      order: [["createdAt", "DESC"]],
    });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStat = async (req, res) => {
  try {
    const stat = await IncubationStat.findByPk(req.params.id);

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
    const stat = await IncubationStat.findByPk(req.params.id);

    if (!stat) {
      return res.status(404).json({ message: "Statistic not found" });
    }

    await stat.destroy();
    res.json({ message: "Statistic deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Incubation Success Stories =====
exports.createSuccessStory = async (req, res) => {
  try {
    const story = await IncubationSuccessStory.create(req.body);
    res.status(201).json(story);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSuccessStories = async (_req, res) => {
  try {
    const stories = await IncubationSuccessStory.findAll({
      include: [IncubationProgram],
      order: [["createdAt", "DESC"]],
    });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSuccessStory = async (req, res) => {
  try {
    const story = await IncubationSuccessStory.findByPk(req.params.id);

    if (!story) {
      return res.status(404).json({ message: "Success story not found" });
    }

    await story.update(req.body);
    res.json(story);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSuccessStory = async (req, res) => {
  try {
    const story = await IncubationSuccessStory.findByPk(req.params.id);

    if (!story) {
      return res.status(404).json({ message: "Success story not found" });
    }

    await story.destroy();
    res.json({ message: "Success story deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
