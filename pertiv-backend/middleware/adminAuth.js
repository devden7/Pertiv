const jwt = require('jsonwebtoken');
const logger = require('../lib/winston/winstonLogger');
const { JWT_SECRET } = require('../config/env');

const adminMiddleware = (req, res, next) => {
  try {
    logger.info('Accesing ADMIN middleware');
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

    req.user = user;
    next();
  } catch (error) {
    logger.error(`ERROR Middleware adminMiddleware - ${error}`);
    next(error);
  }
};

module.exports = adminMiddleware;
