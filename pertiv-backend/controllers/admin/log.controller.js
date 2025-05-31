const { Prisma } = require('@prisma/client');
const logger = require('../../lib/winston/winstonLogger');
const { getLog } = require('../../services/log.service');

const getActivityLogs = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const LIMIT = 20;
    const skip = (page - 1) * LIMIT;
    const keyword = search
      ? {
          OR: [
            {
              level: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              message: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {};

    logger.info(
      `Controller getActivityLogs | Admin with ID : ${id} | Get activity logs`
    );

    const { data, count } = await getLog(skip, LIMIT, keyword);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Access activity logs successfully',
      data,
      totalCount: count,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      error.message = 'Internal Server Error';
      return logger.error(
        `Controller getActivityLogs | Failed to get data from database`
      );
    } else if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
      logger.error(`Controller getActivityLogs | ${error.message}`);
    } else {
      logger.error(`Controller getActivityLogs`);
    }
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

module.exports = getActivityLogs;
