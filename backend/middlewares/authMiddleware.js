const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Middleware to verify user authentication
const authenticate = async (req, res, next) => {
  try {
    let token = null;

    // Priority 1: Check for token in HTTP-only cookie (preferred method)
    if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    // Priority 2: Check for Bearer token in Authorization header (backward compatibility)
    else {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    // If no token found, return unauthorized
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token missing or invalid" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and attach to request
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    req.user = user; // attach user to request
    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "Unauthorized access", error: error.message });
  }
};

//  Role-based authorization middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient permissions" });
    }
    next();
  };
};

module.exports = { authenticate, authorizeRoles };
