const Announcement = require("../../models/latest/AnnouncementModel");
const AnnouncementsHero = require("../../models/latest/announcementsHeroModel");
const { Op } = require("sequelize");

//  Create a new announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const announcementData = { ...req.body };

    // Handle image upload
    if (req.file) {
      announcementData.media_url = req.file.path;
    } else if (req.body.media_url !== undefined) {
      announcementData.media_url = req.body.media_url || null;
    } else if (req.body.image !== undefined) {
      announcementData.media_url = req.body.image || null;
    }

    // Parse date strings
    if (
      announcementData.start_date &&
      typeof announcementData.start_date === "string"
    ) {
      announcementData.start_date = new Date(announcementData.start_date);
    }
    if (
      announcementData.end_date &&
      typeof announcementData.end_date === "string"
    ) {
      announcementData.end_date = new Date(announcementData.end_date);
    }
    if (
      announcementData.deadline &&
      typeof announcementData.deadline === "string"
    ) {
      announcementData.deadline = new Date(announcementData.deadline);
    }

    // Parse boolean strings from FormData
    if (typeof announcementData.is_active === "string") {
      announcementData.is_active = announcementData.is_active === "true";
    }
    if (typeof announcementData.featured === "string") {
      announcementData.featured = announcementData.featured === "true";
    }

    // Parse integer for eventId
    if (
      announcementData.eventId &&
      typeof announcementData.eventId === "string"
    ) {
      const parsed = parseInt(announcementData.eventId, 10);
      announcementData.eventId = isNaN(parsed) ? null : parsed;
    }

    const announcement = await Announcement.create(announcementData);

    res.status(201).json({
      message: "Announcement created successfully",
      data: announcement,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating announcement", error: error.message });
  }
};

// ✅ Get all active announcements (including future and past, as long as is_active is true)
exports.getActiveAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.findAll({
      where: {
        is_active: true,
        // Removed date filters - return all active announcements
        // Frontend will handle categorization into current/past/future
      },
      order: [
        ["priority", "DESC"],
        ["start_date", "DESC"], // Order by start_date instead of createdAt
      ],
    });

    // Transform announcements for frontend
    const transformedAnnouncements = announcements.map((announcement) => {
      const announcementData = announcement.toJSON();

      // Map media_url to image
      announcementData.image = announcementData.media_url || null;

      // Format date (start_date as date)
      if (announcementData.start_date) {
        announcementData.date = new Date(announcementData.start_date)
          .toISOString()
          .split("T")[0];
      }

      // Format end_date if it exists
      if (announcementData.end_date) {
        announcementData.end_date = new Date(announcementData.end_date)
          .toISOString()
          .split("T")[0];
      }

      // Set default values
      announcementData.type = announcementData.type || "update";
      announcementData.category =
        announcementData.category || announcementData.type || "General";
      announcementData.location = announcementData.location || "Online";
      announcementData.excerpt =
        announcementData.excerpt ||
        announcementData.content?.substring(0, 200) + "..." ||
        "";

      return announcementData;
    });

    res.status(200).json(transformedAnnouncements);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching announcements", error: error.message });
  }
};

//  Get all announcements (admin)
exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({
      message: "All announcements fetched successfully",
      data: announcements,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching announcements", error: error.message });
  }
};

//  Get a single announcement by ID
exports.getAnnouncementById = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const announcement = await Announcement.findByPk(id);

    if (!announcement)
      return res.status(404).json({ message: "Announcement not found" });

    res.status(200).json({ data: announcement });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching announcement", error: error.message });
  }
};

//  Update an announcement
exports.updateAnnouncement = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;

    const announcement = await Announcement.findByPk(id);
    if (!announcement)
      return res.status(404).json({ message: "Announcement not found" });

    const updateData = { ...req.body };

    // Handle image upload
    if (req.file) {
      updateData.media_url = req.file.path;
    } else if (req.body.media_url !== undefined) {
      updateData.media_url = req.body.media_url || null;
    } else if (req.body.image !== undefined) {
      updateData.media_url = req.body.image || null;
    }

    // Parse date strings
    if (updateData.start_date && typeof updateData.start_date === "string") {
      updateData.start_date = new Date(updateData.start_date);
    }
    if (updateData.end_date && typeof updateData.end_date === "string") {
      updateData.end_date = new Date(updateData.end_date);
    }
    if (updateData.deadline && typeof updateData.deadline === "string") {
      updateData.deadline = new Date(updateData.deadline);
    }

    // Parse boolean strings from FormData
    if (typeof updateData.is_active === "string") {
      updateData.is_active = updateData.is_active === "true";
    }
    if (typeof updateData.featured === "string") {
      updateData.featured = updateData.featured === "true";
    }

    // Parse integer for eventId
    if (updateData.eventId && typeof updateData.eventId === "string") {
      const parsed = parseInt(updateData.eventId, 10);
      updateData.eventId = isNaN(parsed) ? null : parsed;
    }

    await announcement.update(updateData);

    res.status(200).json({
      message: "Announcement updated successfully",
      data: announcement,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating announcement", error: error.message });
  }
};

//  Delete an announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const announcement = await Announcement.findByPk(id);

    if (!announcement)
      return res.status(404).json({ message: "Announcement not found" });

    await announcement.destroy();

    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting announcement", error: error.message });
  }
};

// ===== Announcements Hero =====
exports.createAnnouncementsHero = async (req, res) => {
  try {
    const hero = await AnnouncementsHero.create(req.body);
    res.status(201).json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAnnouncementsHeroes = async (_req, res) => {
  try {
    const heroes = await AnnouncementsHero.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAnnouncementsHeroById = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const hero = await AnnouncementsHero.findByPk(id);

    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }

    res.json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAnnouncementsHero = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const hero = await AnnouncementsHero.findByPk(id);

    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }

    await hero.update(req.body);
    res.json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAnnouncementsHero = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const hero = await AnnouncementsHero.findByPk(id);

    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }

    await hero.destroy();
    res.json({ message: "Hero deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
