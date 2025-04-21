const jwt = require('jsonwebtoken');
const logger = require('../lib/winston/winstonLogger');
const { JWT_SECRET } = require('../config/env');

const adminMiddleware = (req, res, next) => {
  try {
    logger.info('Admin middleware | Accesing admin middleware');
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      const error = new Error('Bad request!');
      error.success = false;
      error.statusCode = 400;
      throw error;
    }

    const user = jwt.verify(token, JWT_SECRET);

    if (user.role !== 'admin') {
      const error = new Error('Bad request!');
      error.success = false;
      error.statusCode = 400;
      throw error;
    }

    logger.info(
      `Admin middleware | Admin with ID: ${user.id} | accessed the middleware`
    );
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      error.message = 'Invalid token';
      error.success = false;
      error.statusCode = 400;
    }
    logger.error(`Admin middleware | ${error.message}`);
    next(error);
  }
};

module.exports = adminMiddleware;
