const AppError = require('./AppError');

/**
 * Unauthorized error - for authentication failures
 * Status code: 401
 */
class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

module.exports = UnauthorizedError;
