const FooterSection = require("../../models/footer/footerSectionModel");
const FooterSectionLink = require("../../models/footer/footerSectionLinkModel");

// Create a new footer section
exports.createSection = async (req, res) => {
  try {
    const { title, links, order, is_active } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }

    const section = await FooterSection.create({
      title,
      order: order || 0,
      is_active: is_active !== undefined ? is_active : true,
    });

    // Create links if provided
    if (links && Array.isArray(links)) {
      for (const linkData of links) {
        await FooterSectionLink.create({
          label: linkData.label,
          url: linkData.url,
          footerSectionId: section.id,
          order: linkData.order || 0,
          is_active:
            linkData.is_active !== undefined ? linkData.is_active : true,
        });
      }
    }

    // Fetch section with links
    const sectionWithLinks = await FooterSection.findByPk(section.id, {
      include: [
        {
          model: FooterSectionLink,
          as: "links",
        },
      ],
    });

    // Sort links
    if (sectionWithLinks.links && sectionWithLinks.links.length > 0) {
      sectionWithLinks.links.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    res.status(201).json({
      success: true,
      message: "Footer section created successfully",
      data: {
        id: sectionWithLinks.id.toString(),
        title: sectionWithLinks.title,
        links: sectionWithLinks.links
          ? sectionWithLinks.links.map((link) => ({
              id: link.id.toString(),
              label: link.label,
              url: link.url,
            }))
          : [],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all footer sections
exports.getAllSections = async (req, res) => {
  try {
    const sections = await FooterSection.findAll({
      order: [
        ["order", "ASC"],
        ["createdAt", "DESC"],
      ],
      include: [
        {
          model: FooterSectionLink,
          as: "links",
        },
      ],
    });

    // Sort links for each section
    sections.forEach((section) => {
      if (section.links && section.links.length > 0) {
        section.links.sort((a, b) => (a.order || 0) - (b.order || 0));
      }
    });

    res.status(200).json({
      success: true,
      data: sections.map((section) => ({
        id: section.id.toString(),
        title: section.title,
        order: section.order,
        is_active: section.is_active,
        links: section.links
          ? section.links.map((link) => ({
              id: link.id.toString(),
              label: link.label,
              url: link.url,
              order: link.order,
              is_active: link.is_active,
            }))
          : [],
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get footer section by ID
exports.getSectionById = async (req, res) => {
  try {
    const section = await FooterSection.findByPk(req.params.id, {
      include: [
        {
          model: FooterSectionLink,
          as: "links",
        },
      ],
    });

    // Sort links
    if (section && section.links && section.links.length > 0) {
      section.links.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "Footer section not found" });
    }

    res.status(200).json({
      success: true,
      data: {
        id: section.id.toString(),
        title: section.title,
        order: section.order,
        is_active: section.is_active,
        links: section.links
          ? section.links.map((link) => ({
              id: link.id.toString(),
              label: link.label,
              url: link.url,
              order: link.order,
              is_active: link.is_active,
            }))
          : [],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update footer section
exports.updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, links, order, is_active } = req.body;

    const section = await FooterSection.findByPk(id);
    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "Footer section not found" });
    }

    // Update section
    await section.update({
      title: title !== undefined ? title : section.title,
      order: order !== undefined ? order : section.order,
      is_active: is_active !== undefined ? is_active : section.is_active,
    });

    // Update links if provided
    if (links && Array.isArray(links)) {
      // Delete existing links
      await FooterSectionLink.destroy({
        where: { footerSectionId: section.id },
      });

      // Create new links
      for (const linkData of links) {
        await FooterSectionLink.create({
          label: linkData.label,
          url: linkData.url,
          footerSectionId: section.id,
          order: linkData.order || 0,
          is_active:
            linkData.is_active !== undefined ? linkData.is_active : true,
        });
      }
    }

    // Fetch updated section with links
    const updatedSection = await FooterSection.findByPk(section.id, {
      include: [
        {
          model: FooterSectionLink,
          as: "links",
        },
      ],
    });

    // Sort links
    if (updatedSection.links && updatedSection.links.length > 0) {
      updatedSection.links.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    res.status(200).json({
      success: true,
      message: "Footer section updated successfully",
      data: {
        id: updatedSection.id.toString(),
        title: updatedSection.title,
        links: updatedSection.links
          ? updatedSection.links.map((link) => ({
              id: link.id.toString(),
              label: link.label,
              url: link.url,
            }))
          : [],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete footer section
exports.deleteSection = async (req, res) => {
  try {
    const section = await FooterSection.findByPk(req.params.id);
    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "Footer section not found" });
    }

    // Delete associated links first
    await FooterSectionLink.destroy({ where: { footerSectionId: section.id } });

    // Delete section
    await section.destroy();

    res.status(200).json({
      success: true,
      message: "Footer section deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
