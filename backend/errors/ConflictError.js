const AppError = require('./AppError');

/**
 * Conflict error - for resource conflicts (e.g., duplicate email)
 * Status code: 409
 */
class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

module.exports = ConflictError;
