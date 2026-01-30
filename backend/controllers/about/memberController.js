const Member = require("../../models/about/memberModel");

// Create a Member
exports.createMember = async (req, res) => {
  try {
    const photoUrl = req.file ? req.file.path : null;

    const member = await Member.create({
      name: req.body.name,
      role: req.body.role,
      bio: req.body.bio ?? null,
      photo_url: photoUrl,
      type: req.body.type, // must be 'board' or 'staff'
      is_active: req.body.is_active ?? true,
    });

    res.status(201).json(member);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating member", error: error.message });
  }
};

// Get all Members
exports.getMembers = async (req, res) => {
  try {
    const members = await Member.findAll();
    res.status(200).json(members);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching members", error: error.message });
  }
};

// Get single Member by ID
exports.getMemberById = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const member = await Member.findByPk(id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    res.status(200).json(member);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching member", error: error.message });
  }
};

// Update a Member
exports.updateMember = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const member = await Member.findByPk(id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    const photoUrl = req.file
      ? req.file.path
      : req.body.photo_url ?? member.photo_url;

    await member.update({
      name: req.body.name ?? member.name,
      role: req.body.role ?? member.role,
      bio: req.body.bio ?? member.bio,
      photo_url: photoUrl,
      type: req.body.type ?? member.type,
      is_active: req.body.is_active ?? member.is_active,
    });

    res.status(200).json(member);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating member", error: error.message });
  }
};

// Delete a Member
exports.deleteMember = async (req, res) => {
  try {
    // Convert string ID to number for integer primary keys
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    const member = await Member.findByPk(id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    await member.destroy();
    res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting member", error: error.message });
  }
};
