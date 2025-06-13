const prisma = require('../../utils/prismaConnection');
const logger = require('../../lib/winston/winstonLogger');
const { groupAnalyticsChart } = require('../../utils/groupAnalyticChart');
const { Prisma } = require('@prisma/client');
const { getDashboardData } = require('../../services/staff/dashboard.service');

const dashboard = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { start, end, filter } = req.query;
    logger.info(
      `Controller dashboard | staff with ID : ${id} | accessing dashboard with detail date : StartDate ${start} - EndDate ${end}`
    );

    const {
      bookSellingSuccess,
      bookBorrowingSuccess,
      transactionsBookSelling,
      transactionBookBorrowing,
      topTenBookSelling,
      topTenBookBorrowing,
      topStaffHandlingSelling,
      topStaffHandlingLoan,
      topStaffHandlingReturn,
    } = await getDashboardData(start, end, filter);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Dashboard Overview',
      data: {
        pieChart: {
          bookSellingSuccess: bookSellingSuccess,
          bookBorrowingSuccess: bookBorrowingSuccess,
        },
        areaChart: {
          transactionsBookSelling: transactionsBookSelling,
          transactionBookBorrowing: transactionBookBorrowing,
        },
        bookSellingSales: topTenBookSelling,
        topTenBookBorrowing,
        staffBookSellingHandle: topStaffHandlingSelling,
        staffHandlingLoan: topStaffHandlingLoan,
        staffHandlingReturn: topStaffHandlingReturn,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      error.message = 'Internal Server Error';
      logger.error(`Controller dashboard | Failed to get data from database`);
    } else if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
      logger.error(`Controller dashboard | ${error.message}`);
    } else {
      logger.error(`Controller dashboard ${error}`);
    }
    next(error);
  }
};

module.exports = { dashboard };
