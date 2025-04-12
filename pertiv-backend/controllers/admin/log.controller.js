const logger = require('../../lib/winston/winstonLogger');
const prisma = require('../../utils/prismaConnection');

const getActivityLogs = async (req, res, next) => {
  try {
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
    logger.info('`Controller ADMIN getActivityLogs');

    const data = await prisma.log.findMany({
      skip,
      take: LIMIT,
      orderBy: {
        createdAt: 'desc',
      },
      where: keyword,
    });

    const countLogs = await prisma.log.count({
      where: keyword,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Access activity logs successfully',
      data,
      totalCount: countLogs,
    });
  } catch (error) {
    logger.error(`ERROR STAFF Controller getActivityLogs - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

module.exports = getActivityLogs;
