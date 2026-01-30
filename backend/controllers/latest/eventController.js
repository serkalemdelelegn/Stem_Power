const Event = require("../../models/latest/eventsModel");
const EventsHero = require("../../models/latest/eventsHeroModel");

// Create new event
exports.createEvent = async (req, res) => {
  try {
    const eventData = { ...req.body };

    // Handle image upload
    if (req.file) {
      eventData.image_url = req.file.path;
    } else if (req.body.image_url !== undefined) {
      eventData.image_url = req.body.image_url || null;
    } else if (req.body.image !== undefined) {
      eventData.image_url = req.body.image || null;
    }

    // Parse date strings
    if (eventData.start_date && typeof eventData.start_date === "string") {
      eventData.start_date = new Date(eventData.start_date);
    }
    if (eventData.end_date && typeof eventData.end_date === "string") {
      eventData.end_date = new Date(eventData.end_date);
    }

    // Parse boolean strings from FormData
    if (typeof eventData.is_virtual === "string") {
      eventData.is_virtual = eventData.is_virtual === "true";
    }
    if (typeof eventData.featured === "string") {
      eventData.featured = eventData.featured === "true";
    }

    // Parse highlights JSON string from FormData
    if (typeof eventData.highlights === "string") {
      try {
        eventData.highlights = JSON.parse(eventData.highlights);
      } catch {
        eventData.highlights = [];
      }
    }

    // Determine status based on end_date if not provided
    let eventStatus = eventData.status;
    if (!eventStatus && eventData.end_date) {
      const endDate = new Date(eventData.end_date);
      const now = new Date();
      eventStatus = endDate < now ? "past" : "upcoming";
    }

    const newEvent = await Event.create({
      ...eventData,
      highlights: eventData.highlights
        ? JSON.stringify(eventData.highlights)
        : null,
      status: eventStatus || "upcoming",
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: newEvent,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      order: [["start_date", "ASC"]],
      where: { is_active: true },
    });

    // Transform events to include status and format dates
    const transformedEvents = events.map((event) => {
      const eventData = event.toJSON();

      // Determine status if not set
      if (!eventData.status && eventData.end_date) {
        const endDate = new Date(eventData.end_date);
        const now = new Date();
        eventData.status = endDate < now ? "past" : "upcoming";
      }

      // Format dates
      if (eventData.start_date) {
        eventData.date = new Date(eventData.start_date).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        );
      }
      if (eventData.end_date) {
        eventData.endDate = new Date(eventData.end_date).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        );
      }

      // Parse highlights if it's a JSON string
      if (eventData.highlights && typeof eventData.highlights === "string") {
        try {
          eventData.highlights = JSON.parse(eventData.highlights);
        } catch (e) {
          eventData.highlights = [];
        }
      }

      // Map image_url to image for frontend
      eventData.image = eventData.image_url || null;

      // Map event_url to registrationLink if registrationLink is not set
      if (!eventData.registrationLink && eventData.event_url) {
        eventData.registrationLink = eventData.event_url;
      }

      return eventData;
    });

    res.status(200).json(transformedEvents);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single event by ID
exports.getEventById = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const event = await Event.findByPk(id);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const event = await Event.findByPk(id);

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    const updatedData = { ...req.body };

    // Handle image upload
    if (req.file) {
      updatedData.image_url = req.file.path;
    } else if (req.body.image_url !== undefined) {
      updatedData.image_url = req.body.image_url || null;
    } else if (req.body.image !== undefined) {
      updatedData.image_url = req.body.image || null;
    }

    // Parse date strings
    if (updatedData.start_date && typeof updatedData.start_date === "string") {
      updatedData.start_date = new Date(updatedData.start_date);
    }
    if (updatedData.end_date && typeof updatedData.end_date === "string") {
      updatedData.end_date = new Date(updatedData.end_date);
    }

    // Parse boolean strings from FormData
    if (typeof updatedData.is_virtual === "string") {
      updatedData.is_virtual = updatedData.is_virtual === "true";
    }
    if (typeof updatedData.featured === "string") {
      updatedData.featured = updatedData.featured === "true";
    }

    // Parse highlights JSON string from FormData
    if (typeof updatedData.highlights === "string") {
      try {
        updatedData.highlights = JSON.parse(updatedData.highlights);
      } catch {
        updatedData.highlights = [];
      }
    }

    // Determine status if needed
    if (!updatedData.status && updatedData.end_date) {
      const endDate = new Date(updatedData.end_date);
      const now = new Date();
      updatedData.status = endDate < now ? "past" : "upcoming";
    }

    await event.update({
      ...updatedData,
      highlights: updatedData.highlights
        ? JSON.stringify(updatedData.highlights)
        : null,
    });

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const event = await Event.findByPk(id);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    await event.destroy();
    res
      .status(200)
      .json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== Events Hero =====
exports.createEventsHero = async (req, res) => {
  try {
    const heroData = { ...req.body };
    if (req.file) {
      heroData.image = req.file.path;
    } else if (req.body.image_url !== undefined) {
      heroData.image = req.body.image_url || null;
    } else if (req.body.image !== undefined) {
      heroData.image = req.body.image || null;
    }

    const hero = await EventsHero.create(heroData);
    res.status(201).json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEventsHeroes = async (_req, res) => {
  try {
    const heroes = await EventsHero.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEventsHeroById = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const hero = await EventsHero.findByPk(id);

    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }

    res.json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEventsHero = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const hero = await EventsHero.findByPk(id);

    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }

    const updated = { ...req.body };
    if (req.file) {
      updated.image = req.file.path;
    } else if (req.body.image_url !== undefined) {
      updated.image = req.body.image_url || null;
    } else if (req.body.image !== undefined) {
      updated.image = req.body.image || null;
    }

    await hero.update(updated);
    res.json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteEventsHero = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const hero = await EventsHero.findByPk(id);

    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }

    await hero.destroy();
    res.json({ message: "Hero deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
