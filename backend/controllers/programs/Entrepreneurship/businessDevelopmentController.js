const BusinessDevelopmentService = require("../../../models/programs/Entrepreneurship & Incubation/BusinessDevelopment/BusinessDevelopmentService");
const BusinessStat = require("../../../models/programs/Entrepreneurship & Incubation/BusinessDevelopment/BusinessStat");
const FundingPartner = require("../../../models/programs/Entrepreneurship & Incubation/BusinessDevelopment/FundingPartner");
const SuccessStory = require("../../../models/programs/Entrepreneurship & Incubation/BusinessDevelopment/SuccessStory");
const BusinessDevelopmentServiceItem = require("../../../models/programs/Entrepreneurship & Incubation/BusinessDevelopment/BusinessDevelopmentServiceItem");

// ===== Hero (Business Development Service) =====
exports.createHero = async (req, res) => {
  try {
    const { badge, title, description } = req.body;
    const imageUrl = req.file ? req.file.path : req.body.image || null;

    const hero = await BusinessDevelopmentService.create({
      badge: badge || "Business Development",
      title: title || "Business Development Services",
      description: description || "Comprehensive support for entrepreneurs...",
      image: imageUrl,
    });
    res.status(201).json({
      success: true,
      message: "Business Development hero created successfully",
      data: hero,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHero = async (req, res) => {
  try {
    const heroes = await BusinessDevelopmentService.findAll({
      include: [BusinessStat, FundingPartner, SuccessStory],
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
    const hero = await BusinessDevelopmentService.findByPk(id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Business Development hero not found",
      });
    }

    const updateData = {};
    if (req.body.badge !== undefined) updateData.badge = req.body.badge;
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.description !== undefined)
      updateData.description = req.body.description;

    // Use new file if uploaded, otherwise keep existing or use body image
    if (req.file) {
      updateData.image = req.file.path;
    } else if (req.body.image !== undefined) {
      updateData.image = req.body.image || null;
    }

    await hero.update(updateData);
    res.status(200).json({
      success: true,
      message: "Business Development hero updated successfully",
      data: hero,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteHero = async (req, res) => {
  try {
    const { id } = req.params;
    const hero = await BusinessDevelopmentService.findByPk(id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Business Development hero not found",
      });
    }

    await hero.destroy();
    res.status(200).json({
      success: true,
      message: "Business Development hero deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== Statistics =====
exports.createStatistic = async (req, res) => {
  try {
    const { title, value, businessDevServiceId } = req.body;

    if (!title || !value) {
      return res.status(400).json({
        success: false,
        message: "Title and value are required",
      });
    }

    const stat = await BusinessStat.create({
      title,
      value,
      businessDevServiceId,
    });

    res.status(201).json({
      success: true,
      message: "Statistic created successfully",
      data: stat,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStatistics = async (req, res) => {
  try {
    const statistics = await BusinessStat.findAll({
      include: [BusinessDevelopmentService],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStatistic = async (req, res) => {
  try {
    const { id } = req.params;
    const stat = await BusinessStat.findByPk(id);

    if (!stat) {
      return res.status(404).json({
        success: false,
        message: "Statistic not found",
      });
    }

    await stat.update(req.body);
    res.status(200).json({
      success: true,
      message: "Statistic updated successfully",
      data: stat,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteStatistic = async (req, res) => {
  try {
    const { id } = req.params;
    const stat = await BusinessStat.findByPk(id);

    if (!stat) {
      return res.status(404).json({
        success: false,
        message: "Statistic not found",
      });
    }

    await stat.destroy();
    res.status(200).json({
      success: true,
      message: "Statistic deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== Partners (Funding Partners) =====
exports.createPartner = async (req, res) => {
  try {
    const {
      name,
      contribution_description,
      focus_area,
      partnership_duration,
      people_impacted,
      businessDevServiceId,
    } = req.body;

    if (!name || !contribution_description || !focus_area) {
      return res.status(400).json({
        success: false,
        message: "Name, contribution description, and focus area are required",
      });
    }

    const logoUrl = req.file ? req.file.path : req.body.logo || null;

    const partner = await FundingPartner.create({
      name,
      logo: logoUrl,
      contribution_description,
      focus_area,
      partnership_duration: partnership_duration || null,
      people_impacted: people_impacted || null,
      businessDevServiceId,
    });

    res.status(201).json({
      success: true,
      message: "Funding partner created successfully",
      data: partner,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPartners = async (req, res) => {
  try {
    const partners = await FundingPartner.findAll({
      include: [BusinessDevelopmentService],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({
      success: true,
      data: partners,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await FundingPartner.findByPk(id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Funding partner not found",
      });
    }

    const updateData = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.contribution_description !== undefined)
      updateData.contribution_description = req.body.contribution_description;
    if (req.body.focus_area !== undefined)
      updateData.focus_area = req.body.focus_area;
    if (req.body.partnership_duration !== undefined)
      updateData.partnership_duration = req.body.partnership_duration || null;
    if (req.body.people_impacted !== undefined)
      updateData.people_impacted = req.body.people_impacted || null;
    if (req.body.businessDevServiceId !== undefined)
      updateData.businessDevServiceId = req.body.businessDevServiceId;

    // Use new file if uploaded, otherwise keep existing or use body logo
    if (req.file) {
      updateData.logo = req.file.path;
    } else if (req.body.logo !== undefined) {
      updateData.logo = req.body.logo || null;
    }

    await partner.update(updateData);
    res.status(200).json({
      success: true,
      message: "Funding partner updated successfully",
      data: partner,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deletePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await FundingPartner.findByPk(id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Funding partner not found",
      });
    }

    await partner.destroy();
    res.status(200).json({
      success: true,
      message: "Funding partner deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== Success Stories =====
exports.createSuccessStory = async (req, res) => {
  try {
    const {
      business_name,
      license_status,
      category,
      category_color,
      contact_person,
      phone,
      email,
      icon,
      businessDevServiceId,
    } = req.body;

    if (
      !business_name ||
      !license_status ||
      !category ||
      !contact_person ||
      !phone ||
      !email
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Business name, license status, category, contact person, phone, and email are required",
      });
    }

    const successStory = await SuccessStory.create({
      business_name,
      license_status,
      category,
      category_color: category_color || null,
      contact_person,
      phone,
      email,
      icon: icon || null,
      businessDevServiceId,
    });

    res.status(201).json({
      success: true,
      message: "Success story created successfully",
      data: successStory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSuccessStories = async (req, res) => {
  try {
    const successStories = await SuccessStory.findAll({
      include: [BusinessDevelopmentService],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({
      success: true,
      data: successStories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSuccessStory = async (req, res) => {
  try {
    const { id } = req.params;
    const successStory = await SuccessStory.findByPk(id);

    if (!successStory) {
      return res.status(404).json({
        success: false,
        message: "Success story not found",
      });
    }

    await successStory.update(req.body);
    res.status(200).json({
      success: true,
      message: "Success story updated successfully",
      data: successStory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteSuccessStory = async (req, res) => {
  try {
    const { id } = req.params;
    const successStory = await SuccessStory.findByPk(id);

    if (!successStory) {
      return res.status(404).json({
        success: false,
        message: "Success story not found",
      });
    }

    await successStory.destroy();
    res.status(200).json({
      success: true,
      message: "Success story deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== Service Items =====
exports.createServiceItem = async (req, res) => {
  try {
    const {
      name,
      description,
      icon,
      capabilities,
      order,
      businessDevServiceId,
    } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Name and description are required",
      });
    }

    const serviceItem = await BusinessDevelopmentServiceItem.create({
      name,
      description,
      icon: icon || null,
      capabilities: capabilities || [],
      order: order || 0,
      businessDevServiceId: businessDevServiceId || null,
    });

    res.status(201).json({
      success: true,
      message: "Service item created successfully",
      data: serviceItem,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getServiceItems = async (req, res) => {
  try {
    const serviceItems = await BusinessDevelopmentServiceItem.findAll({
      order: [
        ["order", "ASC"],
        ["createdAt", "ASC"],
      ],
    });

    res.status(200).json({
      success: true,
      data: serviceItems,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateServiceItem = async (req, res) => {
  try {
    const { id } = req.params;
    const serviceItem = await BusinessDevelopmentServiceItem.findByPk(id);

    if (!serviceItem) {
      return res.status(404).json({
        success: false,
        message: "Service item not found",
      });
    }

    const updateData = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.description !== undefined)
      updateData.description = req.body.description;
    if (req.body.icon !== undefined) updateData.icon = req.body.icon;
    if (req.body.capabilities !== undefined)
      updateData.capabilities = req.body.capabilities;
    if (req.body.order !== undefined) updateData.order = req.body.order;
    if (req.body.businessDevServiceId !== undefined)
      updateData.businessDevServiceId = req.body.businessDevServiceId;

    await serviceItem.update(updateData);

    res.status(200).json({
      success: true,
      message: "Service item updated successfully",
      data: serviceItem,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteServiceItem = async (req, res) => {
  try {
    const { id } = req.params;
    const serviceItem = await BusinessDevelopmentServiceItem.findByPk(id);

    if (!serviceItem) {
      return res.status(404).json({
        success: false,
        message: "Service item not found",
      });
    }

    await serviceItem.destroy();
    res.status(200).json({
      success: true,
      message: "Service item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
