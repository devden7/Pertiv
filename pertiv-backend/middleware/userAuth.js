const logger = require('../lib/winston/winstonLogger');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

const userMiddleware = (req, res, next) => {
  try {
    logger.info('Accesing USER middleware');
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      const error = new Error('Bad request!');
      error.success = false;
      error.statusCode = 400;
      throw error;
    }

    const user = jwt.verify(token, JWT_SECRET);

    if (user.role !== 'user') {
      const error = new Error('Bad request!');
      error.success = false;
      error.statusCode = 400;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      error.message = 'Invalid token';
      error.success = false;
      error.statusCode = 400;
    }
    logger.error(`User middleware | ${error.message}`);
    next(error);
  }
};

module.exports = userMiddleware;
