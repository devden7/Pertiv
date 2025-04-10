const logger = require('../../lib/winston/winstonLogger');

const getMemberships = async (req, res, next) => {
  try {
    logger.info('Controller USER getMemberships - Get all membership type');
    const findMembershipQuery = await prisma.membership.findMany();

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: findMembershipQuery,
    });
  } catch (error) {
    logger.error(`ERROR USER Controller getMemberships  -  ${error}`);

    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

module.exports = {
  getMemberships,
};
