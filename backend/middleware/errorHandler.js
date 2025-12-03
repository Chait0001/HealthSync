// Centralized error-handling middleware
// Ensures consistent error responses from the API.

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error('API Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    message,
  });
};

export default errorHandler;


