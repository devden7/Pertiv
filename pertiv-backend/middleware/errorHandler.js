const errorHandler = (error, req, res, next) => {
  console.error('Logging Error : ', error);
  const success = error.success || false;
  const message = error.message || 'Internal Server Error';
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success,
    statusCode,
    message,
  });
};

module.exports = errorHandler;
