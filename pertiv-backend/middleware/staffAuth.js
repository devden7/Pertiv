const jwt = require('jsonwebtoken');
const logger = require('../lib/winston/winstonLogger');
const { JWT_SECRET } = require('../config/env');

const staffMiddleware = (req, res, next) => {
  try {
    logger.info('Staff middleware | Accesing staff middleware');
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      const error = new Error('Bad request!');
      error.success = false;
      error.statusCode = 400;
      throw error;
    }

    const user = jwt.verify(token, JWT_SECRET);

    if (user.role !== 'staff') {
      const error = new Error('Bad request!');
      error.success = false;
      error.statusCode = 400;
      throw error;
    }
    logger.info(
      `Staff middleware | Staff with ID: ${user.id} | accessed the middleware`
    );
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      error.message = 'Invalid token';
      error.success = false;
      error.statusCode = 400;
    }
    logger.error(`Staff middleware | ${error.message}`);
    next(error);
  }
};

module.exports = staffMiddleware;
