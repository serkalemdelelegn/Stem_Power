const AppError = require('./AppError');

/**
 * Validation error - for input validation failures
 * Status code: 400
 */
class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors = null) {
    super(message, 400);
    this.name = 'ValidationError';
    this.errors = errors; // Can contain field-specific validation errors
  }
}

module.exports = ValidationError;
