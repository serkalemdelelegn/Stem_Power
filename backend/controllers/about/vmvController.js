const VMV = require("../../models/about/vmvModel");

// Helper function to handle file uploads from req.files
const getFileUrl = (req, fieldName) => {
  if (!req.files || !Array.isArray(req.files)) return null;
  const file = req.files.find((f) => f.fieldname === fieldName);
  return file ? file.path : null;
};

// Create or update all sections (hero, whoWeAre, mission, vision, values)
exports.createOrUpdateAll = async (req, res) => {
  try {
    const {
      badge,
      title,
      description,
      statistic,
      whoWeAreBadge,
      whoWeAreTitle,
      whoWeAreDescription,
      mission,
      vision,
      values,
      whoWeAre,
    } = req.body;

    // Handle whoWeAre if it comes as an object
    let finalWhoWeAreBadge = whoWeAreBadge;
    let finalWhoWeAreTitle = whoWeAreTitle;
    let finalWhoWeAreDescription = whoWeAreDescription;
    if (whoWeAre && typeof whoWeAre === "object") {
      finalWhoWeAreBadge = whoWeAreBadge || whoWeAre.badge || "";
      finalWhoWeAreTitle = whoWeAreTitle || whoWeAre.title || "";
      finalWhoWeAreDescription =
        whoWeAreDescription || whoWeAre.description || "";
    }

    // Parse values if it's a string
    let valuesArray = [];
    if (values) {
      try {
        valuesArray = typeof values === "string" ? JSON.parse(values) : values;
      } catch (e) {
        console.error("[VMV] Error parsing values:", e);
        valuesArray = [];
      }
    }

    // Handle hero image
    const heroImage =
      getFileUrl(req, "file") || getFileUrl(req, "heroImage") || req.body.image;

    // Handle whoWeAre image
    const whoWeAreImage =
      getFileUrl(req, "whoWeAreImage") ||
      req.body.whoWeAreImageUrl ||
      (whoWeAre && whoWeAre.image ? whoWeAre.image : null);

    const results = {};

    // Create or update Hero section
    if (badge || title || description || statistic || heroImage) {
      let hero = await VMV.findOne({
        where: { type: "hero", is_active: true },
      });
      const heroData = {
        type: "hero",
        title: title || "",
        content: description || "",
        badge: badge || "",
        description: description || "",
        image: heroImage || null,
        statistic: statistic || null,
        is_active: true,
      };

      if (hero) {
        await hero.update(heroData);
        results.hero = hero;
      } else {
        hero = await VMV.create(heroData);
        results.hero = hero;
      }
    }

    // Create or update Who We Are section
    if (
      finalWhoWeAreBadge ||
      finalWhoWeAreTitle ||
      finalWhoWeAreDescription ||
      whoWeAreImage
    ) {
      let whoWeAreRecord = await VMV.findOne({
        where: { type: "whoWeAre", is_active: true },
      });
      const whoWeAreData = {
        type: "whoWeAre",
        title: finalWhoWeAreTitle || "",
        content: finalWhoWeAreDescription || "",
        whoWeAreBadge: finalWhoWeAreBadge || "",
        whoWeAreTitle: finalWhoWeAreTitle || "",
        whoWeAreDescription: finalWhoWeAreDescription || "",
        whoWeAreImage: whoWeAreImage || null,
        is_active: true,
      };

      if (whoWeAreRecord) {
        await whoWeAreRecord.update(whoWeAreData);
        results.whoWeAre = whoWeAreRecord;
      } else {
        whoWeAreRecord = await VMV.create(whoWeAreData);
        results.whoWeAre = whoWeAreRecord;
      }
    }

    // Create or update Mission
    if (mission) {
      let missionRecord = await VMV.findOne({
        where: { type: "mission", is_active: true },
      });
      const missionData = {
        type: "mission",
        title: "Mission",
        content: mission,
        is_active: true,
      };

      if (missionRecord) {
        await missionRecord.update(missionData);
        results.mission = missionRecord;
      } else {
        missionRecord = await VMV.create(missionData);
        results.mission = missionRecord;
      }
    }

    // Create or update Vision
    if (vision) {
      let visionRecord = await VMV.findOne({
        where: { type: "vision", is_active: true },
      });
      const visionData = {
        type: "vision",
        title: "Vision",
        content: vision,
        is_active: true,
      };

      if (visionRecord) {
        await visionRecord.update(visionData);
        results.vision = visionRecord;
      } else {
        visionRecord = await VMV.create(visionData);
        results.vision = visionRecord;
      }
    }

    // Handle Values - delete existing and create new ones
    if (Array.isArray(valuesArray) && valuesArray.length > 0) {
      // Delete existing value records
      await VMV.destroy({ where: { type: "value", is_active: true } });

      // Create new value records
      const valueRecords = await Promise.all(
        valuesArray.map((value) =>
          VMV.create({
            type: "value",
            title: value.title || "",
            content: value.description || "",
            is_active: true,
          })
        )
      );
      results.values = valueRecords;
    }

    // Return aggregated data in the format expected by frontend
    // Fetch all active records and aggregate them
    const vmvs = await VMV.findAll({
      where: { is_active: true },
      order: [["createdAt", "ASC"]],
    });

    const aggregated = {
      badge: "",
      title: "",
      description: "",
      image: null,
      statistic: "",
      whoWeAre: {
        badge: "",
        title: "",
        description: "",
        image: "",
      },
      mission: "",
      vision: "",
      values: [],
    };

    vmvs.forEach((vmv) => {
      const data = vmv.toJSON();
      switch (data.type) {
        case "hero":
          aggregated.badge = data.badge || "";
          aggregated.title = data.title || "";
          aggregated.description = data.description || data.content || "";
          aggregated.image = data.image || null;
          aggregated.statistic = data.statistic || "";
          break;
        case "whoWeAre":
          aggregated.whoWeAre.badge = data.whoWeAreBadge || "";
          aggregated.whoWeAre.title = data.whoWeAreTitle || "";
          aggregated.whoWeAre.description =
            data.whoWeAreDescription || data.content || "";
          aggregated.whoWeAre.image = data.whoWeAreImage || "";
          break;
        case "mission":
          aggregated.mission = data.content || "";
          break;
        case "vision":
          aggregated.vision = data.content || "";
          break;
        case "value":
          aggregated.values.push({
            title: data.title || "",
            description: data.content || "",
          });
          break;
      }
    });

    res.status(200).json(aggregated);
  } catch (error) {
    console.error("[VMV] Error creating/updating:", error);
    res
      .status(500)
      .json({ message: "Error creating/updating VMV", error: error.message });
  }
};

// Create VMV
exports.createVMV = async (req, res) => {
  try {
    const {
      type,
      title,
      content,
      is_active,
      badge,
      description,
      image,
      statistic,
      whoWeAreBadge,
      whoWeAreTitle,
      whoWeAreDescription,
      whoWeAreImage,
      values,
      testimonials,
      ecosystem,
    } = req.body;

    const vmv = await VMV.create({
      type,
      title,
      content,
      is_active: is_active ?? true,
      badge,
      description,
      image,
      statistic,
      whoWeAreBadge,
      whoWeAreTitle,
      whoWeAreDescription,
      whoWeAreImage,
      values: values ? JSON.stringify(values) : null,
      testimonials: testimonials ? JSON.stringify(testimonials) : null,
      ecosystem: ecosystem ? JSON.stringify(ecosystem) : null,
    });

    res.status(201).json(vmv);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating VMV", error: error.message });
  }
};

// Get all VMVs
exports.getVMVs = async (req, res) => {
  try {
    const vmvs = await VMV.findAll({
      where: { is_active: true },
      order: [["createdAt", "ASC"]],
    });

    // Transform the data for frontend
    const transformedVMVs = vmvs.map((vmv) => {
      const vmvData = vmv.toJSON();

      // Parse JSON fields
      if (vmvData.values) {
        try {
          vmvData.values = JSON.parse(vmvData.values);
        } catch (e) {
          vmvData.values = [];
        }
      }

      if (vmvData.testimonials) {
        try {
          vmvData.testimonials = JSON.parse(vmvData.testimonials);
        } catch (e) {
          vmvData.testimonials = [];
        }
      }

      if (vmvData.ecosystem) {
        try {
          vmvData.ecosystem = JSON.parse(vmvData.ecosystem);
        } catch (e) {
          vmvData.ecosystem = [];
        }
      }

      return vmvData;
    });

    res.status(200).json(transformedVMVs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching VMVs", error: error.message });
  }
};

// Get aggregated data (for frontend)
exports.getActive = async (req, res) => {
  try {
    const vmvs = await VMV.findAll({
      where: { is_active: true },
      order: [["createdAt", "ASC"]],
    });

    const result = {
      badge: "",
      title: "",
      description: "",
      image: null,
      statistic: "",
      whoWeAre: {
        badge: "",
        title: "",
        description: "",
        image: "",
      },
      mission: "",
      vision: "",
      values: [],
    };

    vmvs.forEach((vmv) => {
      const data = vmv.toJSON();
      switch (data.type) {
        case "hero":
          result.badge = data.badge || "";
          result.title = data.title || "";
          result.description = data.description || data.content || "";
          result.image = data.image || null;
          result.statistic = data.statistic || "";
          break;
        case "whoWeAre":
          result.whoWeAre.badge = data.whoWeAreBadge || "";
          result.whoWeAre.title = data.whoWeAreTitle || "";
          result.whoWeAre.description =
            data.whoWeAreDescription || data.content || "";
          result.whoWeAre.image = data.whoWeAreImage || "";
          break;
        case "mission":
          result.mission = data.content || "";
          break;
        case "vision":
          result.vision = data.content || "";
          break;
        case "value":
          result.values.push({
            title: data.title || "",
            description: data.content || "",
          });
          break;
      }
    });

    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching aggregated VMV data",
        error: error.message,
      });
  }
};

// Get single VMV by ID
exports.getVMVById = async (req, res) => {
  try {
    const vmv = await VMV.findByPk(req.params.id);
    if (!vmv) return res.status(404).json({ message: "VMV not found" });

    res.status(200).json(vmv);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching VMV", error: error.message });
  }
};

// Update VMV
exports.updateVMV = async (req, res) => {
  try {
    const vmv = await VMV.findByPk(req.params.id);
    if (!vmv) return res.status(404).json({ message: "VMV not found" });

    const {
      type,
      title,
      content,
      is_active,
      badge,
      description,
      image,
      statistic,
      whoWeAreBadge,
      whoWeAreTitle,
      whoWeAreDescription,
      whoWeAreImage,
      values,
      testimonials,
      ecosystem,
    } = req.body;

    await vmv.update({
      type: type ?? vmv.type,
      title: title ?? vmv.title,
      content: content ?? vmv.content,
      is_active: is_active ?? vmv.is_active,
      badge: badge !== undefined ? badge : vmv.badge,
      description: description !== undefined ? description : vmv.description,
      image: image !== undefined ? image : vmv.image,
      statistic: statistic !== undefined ? statistic : vmv.statistic,
      whoWeAreBadge:
        whoWeAreBadge !== undefined ? whoWeAreBadge : vmv.whoWeAreBadge,
      whoWeAreTitle:
        whoWeAreTitle !== undefined ? whoWeAreTitle : vmv.whoWeAreTitle,
      whoWeAreDescription:
        whoWeAreDescription !== undefined
          ? whoWeAreDescription
          : vmv.whoWeAreDescription,
      whoWeAreImage:
        whoWeAreImage !== undefined ? whoWeAreImage : vmv.whoWeAreImage,
      values: values !== undefined ? JSON.stringify(values) : vmv.values,
      testimonials:
        testimonials !== undefined
          ? JSON.stringify(testimonials)
          : vmv.testimonials,
      ecosystem:
        ecosystem !== undefined ? JSON.stringify(ecosystem) : vmv.ecosystem,
    });

    res.status(200).json(vmv);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating VMV", error: error.message });
  }
};

// Delete VMV
exports.deleteVMV = async (req, res) => {
  try {
    const vmv = await VMV.findByPk(req.params.id);
    if (!vmv) return res.status(404).json({ message: "VMV not found" });

    await vmv.destroy();
    res.status(200).json({ message: "VMV deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting VMV", error: error.message });
  }
};
