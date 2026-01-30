const Footer = require("../../models/footer/footerModel");
const FooterSocialLink = require("../../models/footer/footerSocialLinkModel");
const FooterSection = require("../../models/footer/footerSectionModel");
const FooterSectionLink = require("../../models/footer/footerSectionLinkModel");

// Get complete footer data
exports.getFooter = async (req, res) => {
  try {
    // Get or create footer (singleton)
    let footer = await Footer.findOne();
    if (!footer) {
      footer = await Footer.create({
        logo: "/STEMpower_s_logo.png",
        description:
          "Empowering Ethiopian youth through science, technology, engineering, and mathematics education.",
        copyrightText:
          "STEMpower Ethiopia. All rights reserved. | Empowering the next generation through STEM education.",
        contactEmail: "info@stempowerethiopia.org",
        contactPhone: "+251 91 123 4567",
        contactAddress: "Addis Ababa, Ethiopia",
      });
    }

    // Get social links
    const socialLinks = await FooterSocialLink.findAll({
      where: { is_active: true },
      order: [["order", "ASC"]],
    });

    // Get sections with their links
    const sections = await FooterSection.findAll({
      where: { is_active: true },
      order: [["order", "ASC"]],
      include: [
        {
          model: FooterSectionLink,
          as: "links",
          where: { is_active: true },
          required: false,
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
      data: {
        logo: footer.logo,
        description: footer.description,
        copyrightText: footer.copyrightText,
        contactEmail: footer.contactEmail,
        contactPhone: footer.contactPhone,
        contactAddress: footer.contactAddress,
        socialLinks: socialLinks.map((link) => ({
          id: link.id.toString(),
          platform: link.platform,
          url: link.url,
        })),
        sections: sections.map((section) => ({
          id: section.id.toString(),
          title: section.title,
          links: section.links
            ? section.links.map((link) => ({
                id: link.id.toString(),
                label: link.label,
                url: link.url,
              }))
            : [],
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update footer basic info
exports.updateFooter = async (req, res) => {
  try {
    let footer = await Footer.findOne();

    // Prepare update data
    const updateData = {
      description: req.body.description,
      copyrightText: req.body.copyrightText,
      contactEmail: req.body.contactEmail,
      contactPhone: req.body.contactPhone,
      contactAddress: req.body.contactAddress,
    };

    // Handle logo upload - if file is uploaded, use file path, otherwise use existing or body logo
    if (req.file) {
      updateData.logo = req.file.path; // Cloudinary URL
    } else if (req.body.logo && !req.body.logo.startsWith("data:")) {
      // Only update logo if it's not a base64 string (data:image/...)
      // If it's a URL, keep it
      if (req.body.logo.startsWith("http") || req.body.logo.startsWith("/")) {
        updateData.logo = req.body.logo;
      }
    }

    if (!footer) {
      footer = await Footer.create(updateData);
    } else {
      await footer.update(updateData);
    }

    res.status(200).json({
      success: true,
      message: "Footer updated successfully",
      data: footer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
