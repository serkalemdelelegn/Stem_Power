const AppError = require('./AppError');

/**
 * Not found error - for resources that don't exist
 * Status code: 404
 */
class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
    this.resource = resource;
  }
}

module.exports = NotFoundError;
