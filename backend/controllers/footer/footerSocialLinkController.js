const FooterSocialLink = require("../../models/footer/footerSocialLinkModel");

// Create a new social link
exports.createSocialLink = async (req, res) => {
  try {
    const { platform, url, order, is_active } = req.body;

    if (!platform || !url) {
      return res
        .status(400)
        .json({ success: false, message: "Platform and URL are required" });
    }

    const socialLink = await FooterSocialLink.create({
      platform,
      url,
      order: order || 0,
      is_active: is_active !== undefined ? is_active : true,
    });

    res.status(201).json({
      success: true,
      message: "Social link created successfully",
      data: {
        id: socialLink.id.toString(),
        platform: socialLink.platform,
        url: socialLink.url,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all social links
exports.getAllSocialLinks = async (req, res) => {
  try {
    const links = await FooterSocialLink.findAll({
      order: [
        ["order", "ASC"],
        ["createdAt", "DESC"],
      ],
    });

    res.status(200).json({
      success: true,
      data: links.map((link) => ({
        id: link.id.toString(),
        platform: link.platform,
        url: link.url,
        order: link.order,
        is_active: link.is_active,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get social link by ID
exports.getSocialLinkById = async (req, res) => {
  try {
    const link = await FooterSocialLink.findByPk(req.params.id);
    if (!link) {
      return res
        .status(404)
        .json({ success: false, message: "Social link not found" });
    }

    res.status(200).json({
      success: true,
      data: {
        id: link.id.toString(),
        platform: link.platform,
        url: link.url,
        order: link.order,
        is_active: link.is_active,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update social link
exports.updateSocialLink = async (req, res) => {
  try {
    const { id } = req.params;
    const link = await FooterSocialLink.findByPk(id);

    if (!link) {
      return res
        .status(404)
        .json({ success: false, message: "Social link not found" });
    }

    await link.update(req.body);

    res.status(200).json({
      success: true,
      message: "Social link updated successfully",
      data: {
        id: link.id.toString(),
        platform: link.platform,
        url: link.url,
        order: link.order,
        is_active: link.is_active,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete social link
exports.deleteSocialLink = async (req, res) => {
  try {
    const link = await FooterSocialLink.findByPk(req.params.id);
    if (!link) {
      return res
        .status(404)
        .json({ success: false, message: "Social link not found" });
    }

    await link.destroy();

    res.status(200).json({
      success: true,
      message: "Social link deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
