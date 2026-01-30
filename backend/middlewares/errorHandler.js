const { AppError } = require('../errors');
const { ValidationError: SequelizeValidationError } = require('sequelize');

/**
 * Global error handling middleware
 * Should be added at the end of the middleware chain in app.js
 */
const errorHandler = (err, req, res, next) => {
  // Set default error values
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    statusCode: error.statusCode,
    name: err.name,
  });

  // Handle Sequelize validation errors
  if (err instanceof SequelizeValidationError) {
    const messages = err.errors.map((e) => e.message);
    error = new AppError(messages.join(', '), 400);
  }

  // Handle Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0]?.path || 'field';
    error = new AppError(
      `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      409
    );
  }

  // Handle Sequelize foreign key constraint errors
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    error = new AppError('Invalid reference to related resource', 400);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expired', 401);
  }

  // Handle cast errors (invalid ID format, etc.)
  if (err.name === 'CastError') {
    error = new AppError('Invalid resource ID format', 400);
  }

  // If error is already an AppError instance, use it as is
  if (err instanceof AppError) {
    error = err;
  }

  // Determine status code
  const statusCode = error.statusCode || 500;
  const status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';

  // Prepare error response
  const errorResponse = {
    success: false,
    status,
    message: error.message || 'Internal server error',
  };

  // Include error details in development mode
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.error = err;
  }

  // Include validation errors if present
  if (error.errors) {
    errorResponse.errors = error.errors;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
