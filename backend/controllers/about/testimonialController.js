const Testimonial = require("../../models/about/testimonialModel");

// Get all active testimonials
exports.getAll = async (_req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      where: { is_active: true },
      order: [
        ["order", "ASC"],
        ["createdAt", "DESC"],
      ],
    });
    res.json(testimonials);
  } catch (error) {
    console.error("[Testimonial] Error fetching testimonials:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all testimonials (including inactive - for admin)
exports.getAllAdmin = async (_req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      order: [
        ["order", "ASC"],
        ["createdAt", "DESC"],
      ],
    });
    res.json(testimonials);
  } catch (error) {
    console.error("[Testimonial] Error fetching all testimonials:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get testimonial by ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByPk(id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res.json(testimonial);
  } catch (error) {
    console.error("[Testimonial] Error fetching testimonial:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create testimonial
exports.create = async (req, res) => {
  try {
    const { name, role, message, order } = req.body;
    const image = req.file ? req.file.path : req.body.image || null;

    const testimonial = await Testimonial.create({
      name,
      role,
      message,
      image,
      order: order || 0,
      is_active: true,
    });

    res.status(201).json(testimonial);
  } catch (error) {
    console.error("[Testimonial] Error creating testimonial:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update testimonial
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, message, order, is_active } = req.body;

    const testimonial = await Testimonial.findByPk(id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    const updateData = {
      name: name !== undefined ? name : testimonial.name,
      role: role !== undefined ? role : testimonial.role,
      message: message !== undefined ? message : testimonial.message,
      order: order !== undefined ? order : testimonial.order,
      is_active: is_active !== undefined ? is_active : testimonial.is_active,
    };

    // Update image if new file is uploaded
    if (req.file) {
      updateData.image = req.file.path;
    } else if (req.body.image !== undefined) {
      updateData.image = req.body.image || null;
    }

    await testimonial.update(updateData);
    res.json(testimonial);
  } catch (error) {
    console.error("[Testimonial] Error updating testimonial:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete testimonial
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByPk(id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    await testimonial.destroy();
    res.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("[Testimonial] Error deleting testimonial:", error);
    res.status(500).json({ error: error.message });
  }
};
