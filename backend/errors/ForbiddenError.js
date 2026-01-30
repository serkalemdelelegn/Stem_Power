const AppError = require('./AppError');

/**
 * Forbidden error - for authorization failures (insufficient permissions)
 * Status code: 403
 */
class ForbiddenError extends AppError {
  constructor(message = 'Access denied: insufficient permissions') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

module.exports = ForbiddenError;
