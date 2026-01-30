const StemTv = require("../../../models/programs/StemCenter/stemTvModel");

// Helper function to extract YouTube video ID from URL
function extractYouTubeId(url) {
  if (!url) return null;
  
  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/.*[?&]v=([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

// Create a new STEM TV video
exports.createStemTv = async (req, res) => {
  try {
    const { title, description, youtube_url } = req.body;
    
    if (!title || !youtube_url) {
      return res.status(400).json({
        success: false,
        message: "Title and YouTube URL are required",
      });
    }
    
    // Extract YouTube ID from URL
    const youtube_id = extractYouTubeId(youtube_url);
    
    const stemTv = await StemTv.create({
      title,
      desctiption: description || "", // Note: model has typo 'desctiption'
      youtube_url,
      youtube_id,
      published_at: req.body.published_at || new Date(),
    });
    
    res.status(201).json({
      success: true,
      message: "STEM TV video created successfully",
      data: stemTv,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all STEM TV videos
exports.getStemTvVideos = async (req, res) => {
  try {
    const videos = await StemTv.findAll({
      order: [["published_at", "DESC"]],
    });
    
    res.status(200).json({
      success: true,
      data: videos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a single STEM TV video by ID
exports.getStemTvById = async (req, res) => {
  try {
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    
    const video = await StemTv.findByPk(id);
    
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "STEM TV video not found",
      });
    }
    
    res.status(200).json({
      success: true,
      data: video,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update a STEM TV video
exports.updateStemTv = async (req, res) => {
  try {
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    
    const video = await StemTv.findByPk(id);
    
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "STEM TV video not found",
      });
    }
    
    // Extract YouTube ID if URL is being updated
    if (req.body.youtube_url) {
      req.body.youtube_id = extractYouTubeId(req.body.youtube_url);
    }
    
    // Handle description field (model has typo)
    if (req.body.description !== undefined) {
      req.body.desctiption = req.body.description;
      delete req.body.description;
    }
    
    await video.update(req.body);
    
    res.status(200).json({
      success: true,
      message: "STEM TV video updated successfully",
      data: video,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a STEM TV video
exports.deleteStemTv = async (req, res) => {
  try {
    const id = /^\d+$/.test(req.params.id)
      ? parseInt(req.params.id, 10)
      : req.params.id;
    
    const video = await StemTv.findByPk(id);
    
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "STEM TV video not found",
      });
    }
    
    await video.destroy();
    
    res.status(200).json({
      success: true,
      message: "STEM TV video deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

