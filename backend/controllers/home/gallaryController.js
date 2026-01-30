const Gallery = require("../../models/home/galleryModel");

// Create Gallery item
exports.createGallery = async (req, res) => {
  try {
    const mediaUrl = req.file ? req.file.path : null;
    if (!mediaUrl) {
      return res.status(400).json({ message: "Media is required" });
    }

    const gallery = await Gallery.create({
      title: req.body.title ?? null,
      caption: req.body.caption ?? null,
      media_url: mediaUrl,
      category: req.body.category ?? null,
      location: req.body.location ?? null,
      participants: req.body.participants ?? 0,
      isActive: req.body.isActive ?? true,
    });

    res.status(201).json(gallery);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating Gallery item", error: error.message });
  }
};

// Get all Gallery items
exports.getGallery = async (req, res) => {
  try {
    const items = await Gallery.findAll();
    res.status(200).json(items);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Gallery items", error: error.message });
  }
};

// Get single Gallery item by ID
exports.getGalleryById = async (req, res) => {
  try {
    const item = await Gallery.findByPk(req.params.id);
    if (!item)
      return res.status(404).json({ message: "Gallery item not found" });

    res.status(200).json(item);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Gallery item", error: error.message });
  }
};

// Update Gallery item
exports.updateGallery = async (req, res) => {
  try {
    const item = await Gallery.findByPk(req.params.id);
    if (!item)
      return res.status(404).json({ message: "Gallery item not found" });

    const mediaUrl = req.file ? req.file.path : item.media_url; // keep old if no new upload

    await item.update({
      title: req.body.title ?? item.title,
      caption: req.body.caption ?? item.caption,
      media_url: mediaUrl,
      category: req.body.category ?? item.category,
      location: req.body.location ?? item.location,
      participants: req.body.participants ?? item.participants,
      isActive: req.body.isActive ?? item.isActive,
    });

    res.status(200).json(item);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Gallery item", error: error.message });
  }
};

// Delete Gallery item
exports.deleteGallery = async (req, res) => {
  try {
    const item = await Gallery.findByPk(req.params.id);
    if (!item)
      return res.status(404).json({ message: "Gallery item not found" });

    await item.destroy();
    res.status(200).json({ message: "Gallery item deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Gallery item", error: error.message });
  }
};
