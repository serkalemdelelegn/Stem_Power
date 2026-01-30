/**
 * Permission middleware to check if user has access to a specific page
 * @param {string} pageId - The page ID to check (e.g., 'home', 'about', 'programs')
 */
const checkPagePermission = (pageId) => {
  return async (req, res, next) => {
    try {
      // If user is not authenticated, deny access
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Super admin (role: 'admin' with null permissions) has full access
      if (req.user.role === 'admin' && (req.user.permissions === null || req.user.permissions === undefined)) {
        return next();
      }

      // Check if user has permission for this page
      if (req.user.permissions && typeof req.user.permissions === 'object') {
        // If permissions object exists, check if this page is allowed
        if (req.user.permissions[pageId] === true) {
          return next();
        } else {
          return res.status(403).json({ 
            message: "Access denied: You don't have permission to access this page" 
          });
        }
      }

      // If permissions is empty object or doesn't include this page, deny access
      return res.status(403).json({ 
        message: "Access denied: You don't have permission to access this page" 
      });
    } catch (error) {
      return res.status(500).json({ 
        message: "Error checking permissions", 
        error: error.message 
      });
    }
  };
};

/**
 * Permission middleware for dynamic pages - checks permission based on program field
 * For 'latest' program, checks 'latest' permission
 * For other programs, checks 'programs' permission
 */
const checkDynamicPagePermission = async (req, res, next) => {
  try {
    // If user is not authenticated, deny access
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Super admin (role: 'admin' with null permissions) has full access
    if (req.user.role === 'admin' && (req.user.permissions === null || req.user.permissions === undefined)) {
      return next();
    }

    // Determine which permission to check based on program field
    let requiredPermission = 'programs'; // default
    
    // For update/delete, check the existing page's program field
    if (req.params.id) {
      const DynamicPage = require('../models/dynamicPageModel');
      const page = await DynamicPage.findByPk(req.params.id);
      if (page && page.program === 'latest') {
        requiredPermission = 'latest';
      }
    } else if (req.body && req.body.program) {
      // For create, check the program field in request body
      const program = req.body.program.toString().trim().toLowerCase();
      if (program === 'latest') {
        requiredPermission = 'latest';
      }
    }

    // Check if user has permission for this page
    if (req.user.permissions && typeof req.user.permissions === 'object') {
      // If permissions object exists, check if this page is allowed
      if (req.user.permissions[requiredPermission] === true) {
        return next();
      } else {
        return res.status(403).json({ 
          message: `Access denied: You don't have permission to access ${requiredPermission} pages` 
        });
      }
    }

    // If permissions is empty object or doesn't include this page, deny access
    return res.status(403).json({ 
      message: `Access denied: You don't have permission to access ${requiredPermission} pages` 
    });
  } catch (error) {
    return res.status(500).json({ 
      message: "Error checking permissions", 
      error: error.message 
    });
  }
};

module.exports = { checkPagePermission, checkDynamicPagePermission };

