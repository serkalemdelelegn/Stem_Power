/**
 * Wrapper utility for async route handlers
 * Ensures async errors are caught and passed to error handling middleware
 * 
 * Usage:
 * router.get('/route', asyncHandler(async (req, res) => {
 *   // async code here
 * }));
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
