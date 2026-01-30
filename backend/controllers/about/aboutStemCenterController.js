const AboutStemCenter = require("../../models/about/aboutStemCenterModel");

/**
 * Create or update (upsert) AboutStemCenter
 * Handles: Hero section, Who We Are section, Mission, Vision, and Core Values
 * Note: Testimonials are managed separately via /api/about/testimonials
 */
exports.createOrUpdate = async (req, res) => {
  try {
    // Find existing active record
    let aboutStemCenter = await AboutStemCenter.findOne({
      where: { is_active: true },
    });

    // Parse JSON fields if they're strings
    // Handle whoWeAre - can come as:
    // 1. Object (JSON request): req.body.whoWeAre
    // 2. Separate fields (FormData): req.body.whoWeAreBadge, req.body.whoWeAreTitle, etc.
    let whoWeAre = req.body.whoWeAre;

    // If whoWeAre is not provided as an object, check for separate fields (FormData)
    if (
      !whoWeAre &&
      (req.body.whoWeAreBadge ||
        req.body.whoWeAreTitle ||
        req.body.whoWeAreDescription)
    ) {
      // Construct whoWeAre object from separate fields
      whoWeAre = {
        badge: req.body.whoWeAreBadge || "",
        title: req.body.whoWeAreTitle || "",
        description: req.body.whoWeAreDescription || "",
        image:
          req.body.whoWeAreImageUrl || aboutStemCenter?.whoWeAre?.image || "",
      };
    } else if (!whoWeAre && aboutStemCenter && aboutStemCenter.whoWeAre) {
      // Preserve existing whoWeAre if not provided
      whoWeAre = aboutStemCenter.whoWeAre;
    } else if (typeof whoWeAre === "string" && whoWeAre.trim()) {
      try {
        whoWeAre = JSON.parse(whoWeAre);
      } catch (e) {
        console.error(
          "[AboutStemCenter] Error parsing whoWeAre:",
          e,
          "Raw value:",
          whoWeAre
        );
        whoWeAre = aboutStemCenter?.whoWeAre || {};
      }
    } else if (!whoWeAre) {
      whoWeAre = {};
    }

    // Ensure whoWeAre is an object
    if (!whoWeAre || typeof whoWeAre !== "object" || Array.isArray(whoWeAre)) {
      whoWeAre = aboutStemCenter?.whoWeAre || {
        badge: "",
        title: "",
        description: "",
        image: "",
      };
    }

    // Update whoWeAre fields if they come as separate fields (FormData) - allows partial updates
    if (req.body.whoWeAreBadge !== undefined) {
      whoWeAre.badge = String(req.body.whoWeAreBadge || "");
    }
    if (req.body.whoWeAreTitle !== undefined) {
      whoWeAre.title = String(req.body.whoWeAreTitle || "");
    }
    if (req.body.whoWeAreDescription !== undefined) {
      whoWeAre.description = String(req.body.whoWeAreDescription || "");
    }
    // Preserve existing image if no new one is provided and no URL is given
    if (!whoWeAre.image && aboutStemCenter?.whoWeAre?.image) {
      whoWeAre.image = aboutStemCenter.whoWeAre.image;
    }

    // Handle values - can come as string (JSON) or array
    let values = req.body.values;
    const hasValuesInRequest =
      values !== undefined && values !== null && values !== "";

    if (!hasValuesInRequest) {
      // If not provided in request, preserve existing or use empty array
      values = aboutStemCenter?.values || [];
    } else if (typeof values === "string" && values.trim()) {
      try {
        values = JSON.parse(values);
      } catch (e) {
        console.error(
          "[AboutStemCenter] Error parsing values:",
          e,
          "Raw value:",
          values
        );
        values = aboutStemCenter?.values || [];
      }
    } else if (Array.isArray(values)) {
      // Already an array, use as is
      values = values;
    } else {
      // Invalid format, use existing or empty
      
      values = aboutStemCenter?.values || [];
    }

    // Ensure values is an array
    if (!Array.isArray(values)) {
      
      values = aboutStemCenter?.values || [];
    }

    // Build data object - use provided values or existing, but always include all fields
    const data = {
      badge:
        req.body.badge !== undefined && req.body.badge !== null
          ? String(req.body.badge)
          : aboutStemCenter?.badge || "",
      title:
        req.body.title !== undefined && req.body.title !== null
          ? String(req.body.title)
          : aboutStemCenter?.title || "",
      description:
        req.body.description !== undefined && req.body.description !== null
          ? String(req.body.description)
          : aboutStemCenter?.description || "",
      statistic:
        req.body.statistic !== undefined && req.body.statistic !== null
          ? String(req.body.statistic)
          : aboutStemCenter?.statistic || "",
      mission:
        req.body.mission !== undefined && req.body.mission !== null
          ? String(req.body.mission)
          : aboutStemCenter?.mission || "",
      vision:
        req.body.vision !== undefined && req.body.vision !== null
          ? String(req.body.vision)
          : aboutStemCenter?.vision || "",
      values: Array.isArray(values) ? values : aboutStemCenter?.values || [],
      whoWeAre: whoWeAre,
      is_active: true,
    };

    // Final safety check - ensure values is an array
    if (!Array.isArray(data.values)) {
      
      data.values = [];
    }
    if (
      !data.whoWeAre ||
      typeof data.whoWeAre !== "object" ||
      Array.isArray(data.whoWeAre)
    ) {
      
      data.whoWeAre = {
        badge: data.whoWeAre?.badge || "",
        title: data.whoWeAre?.title || "",
        description: data.whoWeAre?.description || "",
        image: data.whoWeAre?.image || "",
      };
    }

    // Handle hero image upload
    // Check multiple possible field names
    if (req.files && Array.isArray(req.files)) {
      // Find hero image by field name
      const heroImageFile = req.files.find(
        (f) => f.fieldname === "file" || f.fieldname === "heroImage"
      );
      if (heroImageFile) {
        data.image = heroImageFile.path;
      } else if (req.body.image) {
        data.image = req.body.image;
      }
    } else if (req.files) {
      // Handle object format (from fields)
      if (req.files.file && req.files.file[0]) {
        data.image = req.files.file[0].path;
      } else if (req.files.heroImage && req.files.heroImage[0]) {
        data.image = req.files.heroImage[0].path;
      } else if (req.body.image) {
        data.image = req.body.image;
      }
    } else if (req.file) {
      data.image = req.file.path;
    } else if (req.body.image) {
      data.image = req.body.image;
    } else if (aboutStemCenter?.image) {
      // Preserve existing image if no new one is uploaded
      data.image = aboutStemCenter.image;
    }

    // Handle whoWeAre image
    if (req.files && Array.isArray(req.files)) {
      const whoWeAreImageFile = req.files.find(
        (f) =>
          f.fieldname === "whoWeAreImage" || f.fieldname === "whoWeAreImageFile"
      );
      if (whoWeAreImageFile) {
        data.whoWeAre.image = whoWeAreImageFile.path;
      } else if (req.body.whoWeAreImageUrl) {
        data.whoWeAre.image = req.body.whoWeAreImageUrl;
      } else if (whoWeAre && whoWeAre.image) {
        // Preserve existing image if no new one is uploaded
        data.whoWeAre.image = whoWeAre.image;
      }
    } else if (req.files) {
      if (req.files.whoWeAreImage && req.files.whoWeAreImage[0]) {
        data.whoWeAre.image = req.files.whoWeAreImage[0].path;
      } else if (
        req.files.whoWeAreImageFile &&
        req.files.whoWeAreImageFile[0]
      ) {
        data.whoWeAre.image = req.files.whoWeAreImageFile[0].path;
      } else if (req.body.whoWeAreImageUrl) {
        data.whoWeAre.image = req.body.whoWeAreImageUrl;
      } else if (whoWeAre && whoWeAre.image) {
        data.whoWeAre.image = whoWeAre.image;
      }
    } else if (req.body.whoWeAreImageUrl) {
      data.whoWeAre.image = req.body.whoWeAreImageUrl;
    } else if (whoWeAre && whoWeAre.image) {
      data.whoWeAre.image = whoWeAre.image;
    } else if (aboutStemCenter?.whoWeAre?.image) {
      // Preserve existing image if no new one is uploaded
      data.whoWeAre.image = aboutStemCenter.whoWeAre.image;
    }

    // Ensure whoWeAre has all required fields and is a proper object
    if (
      !data.whoWeAre ||
      typeof data.whoWeAre !== "object" ||
      Array.isArray(data.whoWeAre)
    ) {
      data.whoWeAre = {
        badge: "",
        title: "",
        description: "",
        image: "",
      };
    }

    // Ensure all fields exist (even if empty)
    data.whoWeAre = {
      badge: String(data.whoWeAre.badge || ""),
      title: String(data.whoWeAre.title || ""),
      description: String(data.whoWeAre.description || ""),
      image: String(data.whoWeAre.image || ""),
    };

    if (aboutStemCenter) {
      // Update existing record - explicitly set JSON fields
      const updateData = {
        badge: data.badge,
        title: data.title,
        description: data.description,
        image: data.image || aboutStemCenter.image,
        statistic: data.statistic,
        mission: data.mission || "",
        vision: data.vision || "",
        values: Array.isArray(data.values) ? data.values : [],
        whoWeAre: data.whoWeAre, // Ensure this is a plain object, not a Sequelize instance
        is_active: true,
      };

      // Update all fields together including JSON fields
      // Ensure JSON fields are plain objects (not Sequelize instances)
      const finalUpdateData = {
        ...updateData,
        whoWeAre: JSON.parse(JSON.stringify(updateData.whoWeAre)), // Deep clone to ensure plain object
        values: JSON.parse(JSON.stringify(updateData.values)), // Deep clone to ensure plain array
      };

      await aboutStemCenter.update(finalUpdateData);

      // Force reload with fresh data from database
      await aboutStemCenter.reload({ raw: false });

      // If whoWeAre came back as a string, parse it
      if (typeof aboutStemCenter.whoWeAre === "string") {
        try {
          aboutStemCenter.whoWeAre = JSON.parse(aboutStemCenter.whoWeAre);
        } catch (e) {
          console.error("[AboutStemCenter] Error parsing whoWeAre string:", e);
        }
      }

      // If whoWeAre is not properly loaded, try to parse it
      if (
        !aboutStemCenter.whoWeAre ||
        typeof aboutStemCenter.whoWeAre !== "object"
      ) {
        console.warn(
          "[AboutStemCenter] whoWeAre not properly loaded, attempting to fix..."
        );
        // Try to get the raw value and parse it
        const rawRecord = await AboutStemCenter.findByPk(aboutStemCenter.id, {
          raw: true,
        });
        if (rawRecord && rawRecord.whoWeAre) {
          if (typeof rawRecord.whoWeAre === "string") {
            try {
              aboutStemCenter.whoWeAre = JSON.parse(rawRecord.whoWeAre);
            } catch (e) {
              console.error("[AboutStemCenter] Failed to parse whoWeAre:", e);
            }
          } else {
            aboutStemCenter.whoWeAre = rawRecord.whoWeAre;
          }
        }
      }

      res.json(aboutStemCenter);
    } else {
      // Create new record - ensure JSON fields are properly structured as plain objects
      const createData = {
        badge: data.badge,
        title: data.title,
        description: data.description,
        image: data.image || "",
        statistic: data.statistic,
        mission: data.mission || "",
        vision: data.vision || "",
        values: JSON.parse(
          JSON.stringify(Array.isArray(data.values) ? data.values : [])
        ), // Deep clone
        whoWeAre: JSON.parse(JSON.stringify(data.whoWeAre)), // Deep clone to ensure plain object
        is_active: true,
      };

      aboutStemCenter = await AboutStemCenter.create(createData);

      // Reload to ensure we get the properly parsed JSON
      await aboutStemCenter.reload();

      res.status(201).json(aboutStemCenter);
    }
  } catch (error) {
    console.error("[AboutStemCenter] Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get active AboutStemCenter (for public-facing pages)
 */
exports.getActive = async (_req, res) => {
  try {
    const aboutStemCenter = await AboutStemCenter.findOne({
      where: { is_active: true },
      order: [["createdAt", "DESC"]],
    });

    if (!aboutStemCenter) {
      return res.json(null);
    }

    // Ensure JSON fields are properly parsed
    // Some databases return JSON as strings, so we need to parse them
    if (
      aboutStemCenter.whoWeAre &&
      typeof aboutStemCenter.whoWeAre === "string"
    ) {
      try {
        aboutStemCenter.whoWeAre = JSON.parse(aboutStemCenter.whoWeAre);
      } catch (e) {
        console.error(
          "[AboutStemCenter] Error parsing whoWeAre in getActive:",
          e
        );
      }
    }

    if (aboutStemCenter.values && typeof aboutStemCenter.values === "string") {
      try {
        aboutStemCenter.values = JSON.parse(aboutStemCenter.values);
      } catch (e) {
        console.error(
          "[AboutStemCenter] Error parsing values in getActive:",
          e
        );
      }
    }

    res.json(aboutStemCenter);
  } catch (error) {
    console.error("[AboutStemCenter] Error fetching active:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all AboutStemCenter records (for admin)
 */
exports.getAll = async (_req, res) => {
  try {
    const aboutStemCenters = await AboutStemCenter.findAll({
      order: [["createdAt", "DESC"]],
    });

    // Ensure JSON fields are properly parsed for all records
    aboutStemCenters.forEach((record) => {
      if (record.whoWeAre && typeof record.whoWeAre === "string") {
        try {
          record.whoWeAre = JSON.parse(record.whoWeAre);
        } catch (e) {
          console.error(
            "[AboutStemCenter] Error parsing whoWeAre in getAll:",
            e
          );
        }
      }

      if (record.values && typeof record.values === "string") {
        try {
          record.values = JSON.parse(record.values);
        } catch (e) {
          console.error("[AboutStemCenter] Error parsing values in getAll:", e);
        }
      }
    });

    res.json(aboutStemCenters);
  } catch (error) {
    console.error("[AboutStemCenter] Error fetching all:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get AboutStemCenter by ID
 */
exports.getById = async (req, res) => {
  try {
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const aboutStemCenter = await AboutStemCenter.findByPk(id);

    if (!aboutStemCenter) {
      return res.status(404).json({ message: "About STEM Center not found" });
    }

    // Ensure JSON fields are properly parsed
    if (
      aboutStemCenter.whoWeAre &&
      typeof aboutStemCenter.whoWeAre === "string"
    ) {
      try {
        aboutStemCenter.whoWeAre = JSON.parse(aboutStemCenter.whoWeAre);
      } catch (e) {
        console.error(
          "[AboutStemCenter] Error parsing whoWeAre in getById:",
          e
        );
      }
    }

    if (aboutStemCenter.values && typeof aboutStemCenter.values === "string") {
      try {
        aboutStemCenter.values = JSON.parse(aboutStemCenter.values);
      } catch (e) {
        console.error("[AboutStemCenter] Error parsing values in getById:", e);
      }
    }

    res.json(aboutStemCenter);
  } catch (error) {
    console.error("[AboutStemCenter] Error fetching by ID:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update AboutStemCenter by ID
 */
exports.updateById = async (req, res) => {
  try {
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const aboutStemCenter = await AboutStemCenter.findByPk(id);

    if (!aboutStemCenter) {
      return res.status(404).json({ message: "About STEM Center not found" });
    }

    const data = { ...req.body };

    // Handle image upload - check multiple possible field names
    if (req.files) {
      if (req.files.file && req.files.file[0]) {
        data.image = req.files.file[0].path;
      } else if (req.files.heroImage && req.files.heroImage[0]) {
        data.image = req.files.heroImage[0].path;
      }
    } else if (req.file) {
      data.image = req.file.path;
    }

    // Handle whoWeAre image
    if (req.files) {
      if (req.files.whoWeAreImage && req.files.whoWeAreImage[0]) {
        if (!data.whoWeAre) data.whoWeAre = {};
        data.whoWeAre.image = req.files.whoWeAreImage[0].path;
      } else if (
        req.files.whoWeAreImageFile &&
        req.files.whoWeAreImageFile[0]
      ) {
        if (!data.whoWeAre) data.whoWeAre = {};
        data.whoWeAre.image = req.files.whoWeAreImageFile[0].path;
      }
    }

    await aboutStemCenter.update(data);
    res.json(aboutStemCenter);
  } catch (error) {
    console.error("[AboutStemCenter] Error updating by ID:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete AboutStemCenter by ID
 */
exports.deleteById = async (req, res) => {
  try {
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const aboutStemCenter = await AboutStemCenter.findByPk(id);

    if (!aboutStemCenter) {
      return res.status(404).json({ message: "About STEM Center not found" });
    }

    await aboutStemCenter.destroy();
    res.json({ message: "About STEM Center deleted successfully" });
  } catch (error) {
    console.error("[AboutStemCenter] Error deleting:", error);
    res.status(500).json({ error: error.message });
  }
};
