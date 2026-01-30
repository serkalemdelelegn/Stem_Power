const HeaderLink = require("../models/headerLinkModel");

exports.createHeaderLink = async (req, res) => {
  try {
    const { label, url, order = 0, children = [] } = req.body;

    if (!label || !url) {
      return res
        .status(400)
        .json({ message: "Label and URL are required for navigation items." });
    }

    const item = await HeaderLink.create({
      label,
      url,
      order,
      children,
      isActive: req.body.isActive ?? true,
    });

    return res.status(201).json(item);
  } catch (error) {
    console.error("Error creating header link:", error);
    return res
      .status(500)
      .json({ message: "Error creating header link", error: error.message });
  }
};

exports.getHeaderLinks = async (_req, res) => {
  try {
    const items = await HeaderLink.findAll({
      where: { isActive: true },
      order: [
        ["order", "ASC"],
        ["createdAt", "ASC"],
      ],
    });
    return res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching header links:", error);
    return res
      .status(500)
      .json({ message: "Error fetching header links", error: error.message });
  }
};

exports.getHeaderLinkById = async (req, res) => {
  try {
    const item = await HeaderLink.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Header link not found" });
    }
    return res.status(200).json(item);
  } catch (error) {
    console.error("Error fetching header link:", error);
    return res
      .status(500)
      .json({ message: "Error fetching header link", error: error.message });
  }
};

exports.updateHeaderLink = async (req, res) => {
  try {
    const item = await HeaderLink.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Header link not found" });
    }

    await item.update({
      label: req.body.label ?? item.label,
      url: req.body.url ?? item.url,
      order: req.body.order ?? item.order,
      children: req.body.children ?? item.children,
      isActive: req.body.isActive ?? item.isActive,
    });

    return res.status(200).json(item);
  } catch (error) {
    console.error("Error updating header link:", error);
    return res
      .status(500)
      .json({ message: "Error updating header link", error: error.message });
  }
};

exports.deleteHeaderLink = async (req, res) => {
  try {
    const item = await HeaderLink.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Header link not found" });
    }
    await item.destroy();
    return res
      .status(200)
      .json({ message: "Header link deleted successfully" });
  } catch (error) {
    console.error("Error deleting header link:", error);
    return res
      .status(500)
      .json({ message: "Error deleting header link", error: error.message });
  }
};
