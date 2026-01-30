const QuickLink = require("../../models/footer/quickLinksModel");

// Create a new QuickLink
exports.createQuickLink = async (req, res) => {
  try {
    const { title, url, category, order, is_active } = req.body;

    const quickLink = await QuickLink.create({
      title,
      url,
      category,
      order,
      is_active,
    });

    res.status(201).json({
      success: true,
      message: "Quick link created successfully",
      data: quickLink,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all QuickLinks
exports.getAllQuickLinks = async (req, res) => {
  try {
    const quickLinks = await QuickLink.findAll({
      order: [["order", "ASC"], ["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, data: quickLinks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get QuickLink by ID
exports.getQuickLinkById = async (req, res) => {
  try {
    const quickLink = await QuickLink.findByPk(req.params.id);
    if (!quickLink) {
      return res
        .status(404)
        .json({ success: false, message: "Quick link not found" });
    }

    res.status(200).json({ success: true, data: quickLink });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update QuickLink
exports.updateQuickLink = async (req, res) => {
  try {
    const { id } = req.params;
    const quickLink = await QuickLink.findByPk(id);

    if (!quickLink) {
      return res
        .status(404)
        .json({ success: false, message: "Quick link not found" });
    }

    await quickLink.update(req.body);

    res.status(200).json({
      success: true,
      message: "Quick link updated successfully",
      data: quickLink,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete QuickLink
exports.deleteQuickLink = async (req, res) => {
  try {
    const quickLink = await QuickLink.findByPk(req.params.id);
    if (!quickLink) {
      return res
        .status(404)
        .json({ success: false, message: "Quick link not found" });
    }

    await quickLink.destroy();

    res.status(200).json({
      success: true,
      message: "Quick link deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
