const ContactOffice = require("../../models/contact_us/contactOfficeModel");

// Create Contact Office
exports.createContactOffice = async (req, res) => {
  try {
    // Handle file uploads first
    let imageUrl = null;
    if (req.files && Array.isArray(req.files)) {
      const imageFile = req.files.find(
        (f) => f.fieldname === "file" || f.fieldname === "image" || f.fieldname === "contactImage"
      );
      if (imageFile) {
        imageUrl = imageFile.path;
      }
    } else if (req.file) {
      imageUrl = req.file.path;
    }

    // Parse body - could be JSON or form data
    let bodyData = req.body || {};
    
    // If body is a string, try to parse as JSON
    if (typeof req.body === "string") {
      try {
        bodyData = JSON.parse(req.body);
      } catch (e) {
        // If parsing fails, use empty object
        bodyData = {};
      }
    }
    
    // If body is empty or undefined, use empty object
    if (!bodyData || (typeof bodyData === 'object' && Object.keys(bodyData).length === 0 && !Array.isArray(bodyData))) {
      bodyData = {};
    }

    // Extract fields with defaults - handle both JSON and FormData
    const country_office = bodyData.country_office || "Ethiopia";
    const office_name = bodyData.office_name || null;
    const address = bodyData.address || null;
    const city = bodyData.city || null;
    const region = bodyData.region || null;
    const postal_code = bodyData.postal_code || null;
    const email = bodyData.email || null;
    const phone = bodyData.phone || null;
    const mobile = bodyData.mobile || null;
    const latitude = bodyData.latitude ? (typeof bodyData.latitude === 'string' ? parseFloat(bodyData.latitude) : bodyData.latitude) : null;
    const longtiude = bodyData.longtiude ? (typeof bodyData.longtiude === 'string' ? parseFloat(bodyData.longtiude) : bodyData.longtiude) : null;
    const map_link = bodyData.map_link || bodyData.mapLink || null;
    const website = bodyData.website || null;
    const office_hours = bodyData.office_hours || bodyData.officeHours || null;
    const image = bodyData.image || null;

    const office = await ContactOffice.create({
      country_office,
      office_name,
      address,
      city,
      region,
      postal_code,
      email,
      phone,
      mobile,
      latitude,
      longtiude,
      map_link,
      website,
      office_hours,
      image: imageUrl || image || null,
    });

    res.status(201).json(office);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating contact office", error: error.message });
  }
};

// Get all Contact Offices
exports.getContactOffices = async (req, res) => {
  try {
    const offices = await ContactOffice.findAll();
    res.status(200).json(offices);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching contact offices",
        error: error.message,
      });
  }
};

// Get single Contact Office by ID
exports.getContactOfficeById = async (req, res) => {
  try {
    // Convert ID to number if it's a numeric string (Sequelize expects number for integer PKs)
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const office = await ContactOffice.findByPk(id);
    if (!office)
      return res.status(404).json({ message: "Contact office not found" });

    res.status(200).json(office);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching contact office", error: error.message });
  }
};

// Update Contact Office
exports.updateContactOffice = async (req, res) => {
  try {
    // Convert ID to number if it's a numeric string (Sequelize expects number for integer PKs)
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const office = await ContactOffice.findByPk(id);
    if (!office)
      return res.status(404).json({ message: "Contact office not found" });

    // Debug: Log what we're receiving
    console.log("[ContactOffice Update] Request received:", {
      contentType: req.headers["content-type"],
      hasBody: !!req.body,
      bodyKeys: req.body ? Object.keys(req.body) : [],
      hasFiles: !!(req.files || req.file),
      filesCount: req.files ? req.files.length : 0,
    });

    // Handle file uploads first
    let imageUrl = null;
    if (req.files && Array.isArray(req.files)) {
      const imageFile = req.files.find(
        (f) => f.fieldname === "file" || f.fieldname === "image" || f.fieldname === "contactImage"
      );
      if (imageFile) {
        imageUrl = imageFile.path;
        console.log("[ContactOffice Update] Image uploaded:", imageUrl);
      }
    } else if (req.file) {
      imageUrl = req.file.path;
      console.log("[ContactOffice Update] Image uploaded:", imageUrl);
    }

    // Parse body - could be JSON or form data
    // With multer, FormData fields are already parsed into req.body
    let bodyData = req.body || {};
    
    // If body is a string, try to parse as JSON
    if (typeof req.body === "string") {
      try {
        bodyData = JSON.parse(req.body);
      } catch (e) {
        // If parsing fails, use empty object
        bodyData = {};
      }
    }
    
    // If body is empty or undefined, use empty object
    // This can happen if no fields were sent or multer didn't parse them
    if (!bodyData || (typeof bodyData === 'object' && Object.keys(bodyData).length === 0 && !Array.isArray(bodyData))) {
      console.log("[ContactOffice Update] Warning: req.body is empty, using defaults");
      bodyData = {};
    }
    
    console.log("[ContactOffice Update] Parsed bodyData:", {
      keys: Object.keys(bodyData),
      sample: Object.keys(bodyData).slice(0, 5).reduce((acc, key) => {
        acc[key] = bodyData[key];
        return acc;
      }, {}),
    });

    // Extract fields with defaults - handle both JSON and FormData
    // FormData fields come as strings, JSON fields come as their types
    const country_office = bodyData.country_office || "Ethiopia";
    const office_name = bodyData.office_name || null;
    const address = bodyData.address || null;
    const city = bodyData.city || null;
    const region = bodyData.region || null;
    const postal_code = bodyData.postal_code || null;
    const email = bodyData.email || null;
    const phone = bodyData.phone || null;
    const mobile = bodyData.mobile || null;
    const latitude = bodyData.latitude ? (typeof bodyData.latitude === 'string' ? parseFloat(bodyData.latitude) : bodyData.latitude) : null;
    const longtiude = bodyData.longtiude ? (typeof bodyData.longtiude === 'string' ? parseFloat(bodyData.longtiude) : bodyData.longtiude) : null;
    const map_link = bodyData.map_link || bodyData.mapLink || null;
    const website = bodyData.website || null;
    const office_hours = bodyData.office_hours || bodyData.officeHours || null;
    const image = bodyData.image || null;

    console.log("Updating contact office with data:", {
      id,
      map_link,
      website,
      office_hours,
      mobile,
      image: imageUrl || image,
      bodyDataKeys: Object.keys(bodyData),
    });

    // Prepare update object - always include all fields that were provided
    // If bodyData is empty, we'll preserve existing values by only updating provided fields
    const updateData = {};
    
    // Always set country_office (required field)
    updateData.country_office = country_office;
    
    // Only update fields that were provided in the request
    // Check if the field exists in bodyData (not just if it's defined, since defaults are set)
    if (bodyData.office_name !== undefined) updateData.office_name = office_name || null;
    if (bodyData.address !== undefined) updateData.address = address || null;
    if (bodyData.city !== undefined) updateData.city = city || null;
    if (bodyData.region !== undefined) updateData.region = region || null;
    if (bodyData.postal_code !== undefined) updateData.postal_code = postal_code || null;
    if (bodyData.email !== undefined) updateData.email = email || null;
    if (bodyData.phone !== undefined) updateData.phone = phone || null;
    if (bodyData.mobile !== undefined) updateData.mobile = mobile || null;
    if (bodyData.latitude !== undefined) updateData.latitude = latitude || null;
    if (bodyData.longtiude !== undefined) updateData.longtiude = longtiude || null;
    if (bodyData.map_link !== undefined || bodyData.mapLink !== undefined) updateData.map_link = map_link || null;
    if (bodyData.website !== undefined) updateData.website = website || null;
    if (bodyData.office_hours !== undefined || bodyData.officeHours !== undefined) updateData.office_hours = office_hours || null;
    
    // Handle image - use uploaded file URL or existing image URL
    if (imageUrl) {
      updateData.image = imageUrl;
    } else if (bodyData.image !== undefined) {
      updateData.image = image || null;
    }
    
    console.log("[ContactOffice Update] Update data:", Object.keys(updateData));

    await office.update(updateData);
    
    // Reload to get updated data
    await office.reload();

    console.log("Updated contact office:", office.toJSON());
    res.status(200).json(office);
  } catch (error) {
    console.error("Error updating contact office:", error);
    res
      .status(500)
      .json({ message: "Error updating contact office", error: error.message });
  }
};

// Delete Contact Office
exports.deleteContactOffice = async (req, res) => {
  try {
    // Convert ID to number if it's a numeric string (Sequelize expects number for integer PKs)
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const office = await ContactOffice.findByPk(id);
    if (!office)
      return res.status(404).json({ message: "Contact office not found" });

    await office.destroy();
    res.status(200).json({ message: "Contact office deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting contact office", error: error.message });
  }
};
