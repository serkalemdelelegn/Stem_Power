const DynamicPage = require("../models/dynamicPageModel");

const normalizeSlug = (slug = "") =>
  slug
    .toString()
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();

const normalizeProgram = (program = "") => {
  const value = program.toString().trim();
  return value ? value.toLowerCase() : null;
};

exports.createPage = async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      heroImage,
      heroTitle,
      heroSubtitle,
      heroDescription,
      ctaText,
      ctaLink,
      sections = [],
      status = "draft",
      program = null,
    } = req.body;

    if (!title || !slug) {
      return res
        .status(400)
        .json({ message: "Title and slug are required for a page." });
    }

    const normalizedSlug = normalizeSlug(slug);

    const existing = await DynamicPage.findOne({
      where: { slug: normalizedSlug },
    });
    if (existing) {
      return res.status(400).json({ message: "Slug already exists." });
    }

    const page = await DynamicPage.create({
      title,
      slug: normalizedSlug,
      program: normalizeProgram(program),
      description,
      heroImage,
      heroTitle,
      heroSubtitle,
      heroDescription,
      ctaText,
      ctaLink,
      sections,
      status: status === "published" ? "published" : "draft",
      publishedAt: status === "published" ? new Date() : null,
    });

    return res.status(201).json(page);
  } catch (error) {
    console.error("Error creating dynamic page:", error);
    return res
      .status(500)
      .json({ message: "Error creating dynamic page", error: error.message });
  }
};

exports.getPages = async (req, res) => {
  try {
    const { slug, status, program } = req.query;
    const where = {};

    if (slug) {
      where.slug = normalizeSlug(slug);
    }
    if (status) {
      where.status = status;
    }
    if (program) {
      where.program = normalizeProgram(program);
    }

    const pages = await DynamicPage.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    if (slug) {
      return res.status(200).json(pages[0] || null);
    }

    return res.status(200).json(pages);
  } catch (error) {
    console.error("Error fetching pages:", error);
    return res
      .status(500)
      .json({ message: "Error fetching pages", error: error.message });
  }
};

exports.getPageById = async (req, res) => {
  try {
    const page = await DynamicPage.findByPk(req.params.id);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    return res.status(200).json(page);
  } catch (error) {
    console.error("Error fetching page by id:", error);
    return res
      .status(500)
      .json({ message: "Error fetching page", error: error.message });
  }
};

exports.getPageBySlug = async (req, res) => {
  try {
    const slug = normalizeSlug(req.params.slug);
    const page = await DynamicPage.findOne({ where: { slug } });
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    return res.status(200).json(page);
  } catch (error) {
    console.error("Error fetching page by slug:", error);
    return res
      .status(500)
      .json({ message: "Error fetching page", error: error.message });
  }
};

exports.updatePage = async (req, res) => {
  try {
    const page = await DynamicPage.findByPk(req.params.id);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    const payload = { ...req.body };

    if (payload.program !== undefined) {
      payload.program = normalizeProgram(payload.program);
    }

    if (payload.slug) {
      payload.slug = normalizeSlug(payload.slug);
      const existing = await DynamicPage.findOne({
        where: { slug: payload.slug },
      });
      if (existing && existing.id !== page.id) {
        return res.status(400).json({ message: "Slug already exists." });
      }
    }

    if (payload.status) {
      payload.status = payload.status === "published" ? "published" : "draft";
      if (payload.status === "published" && !page.publishedAt) {
        payload.publishedAt = new Date();
      }
      if (payload.status === "draft") {
        payload.publishedAt = null;
      }
    }

    await page.update(payload);
    return res.status(200).json(page);
  } catch (error) {
    console.error("Error updating page:", error);
    return res
      .status(500)
      .json({ message: "Error updating page", error: error.message });
  }
};

exports.deletePage = async (req, res) => {
  try {
    const page = await DynamicPage.findByPk(req.params.id);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    await page.destroy();
    return res.status(200).json({ message: "Page deleted successfully" });
  } catch (error) {
    console.error("Error deleting page:", error);
    return res
      .status(500)
      .json({ message: "Error deleting page", error: error.message });
  }
};
