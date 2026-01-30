const SocialLink = require("../../models/contact_us/socialLinkModel");

// Create a new social link
exports.createSocialLink = async (req, res) => {
  try {
    const { platform, url, icon } = req.body;

    if (!platform || !url || !icon) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const socialLink = await SocialLink.create({ platform, url, icon });
    res.status(201).json(socialLink);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating social link", error: error.message });
  }
};

// Get all social links
exports.getSocialLinks = async (req, res) => {
  try {
    const links = await SocialLink.findAll();
    res.status(200).json(links);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching social links", error: error.message });
  }
};

// Get single social link by ID
exports.getSocialLinkById = async (req, res) => {
  try {
    // Convert ID to number if it's a numeric string (Sequelize expects number for integer PKs)
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const link = await SocialLink.findByPk(id);
    if (!link)
      return res.status(404).json({ message: "Social link not found" });

    res.status(200).json(link);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching social link", error: error.message });
  }
};

// Update a social link
exports.updateSocialLink = async (req, res) => {
  try {
    // Convert ID to number if it's a numeric string (Sequelize expects number for integer PKs)
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const link = await SocialLink.findByPk(id);
    if (!link)
      return res.status(404).json({ message: "Social link not found" });

    await link.update({
      platform: req.body.platform ?? link.platform,
      url: req.body.url ?? link.url,
      icon: req.body.icon ?? link.icon,
    });

    res.status(200).json(link);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating social link", error: error.message });
  }
};

// Delete a social link
exports.deleteSocialLink = async (req, res) => {
  try {
    // Convert ID to number if it's a numeric string (Sequelize expects number for integer PKs)
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const link = await SocialLink.findByPk(id);
    if (!link)
      return res.status(404).json({ message: "Social link not found" });

    await link.destroy();
    res.status(200).json({ message: "Social link deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting social link", error: error.message });
  }
};
