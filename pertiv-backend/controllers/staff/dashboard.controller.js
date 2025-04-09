const prisma = require('../../utils/prismaConnection');
const logger = require('../../lib/winston/winstonLogger');
const { groupAnalyticsChart } = require('../../utils/groupAnalyticChart');

const dashboard = async (req, res, next) => {
  try {
    const { start, end, filter } = req.query;
    logger.info(
      `Controller STAFF dashboard - StarDate : ${start} || EndDate ${end}`
    );

    //FOR PIE CHART BOOK SELLING
    const findOrderSuccessQuery = await prisma.order.count({
      where: {
        created_at: {
          lte: new Date(end).toISOString(),
          gte: new Date(start).toISOString(),
        },
        status: 'success',
      },
    });

    //FOR PIE CHART BOOK BORROWING
    const findOrderSuccessBorrowingQuery = await prisma.bookBorrowed.count({
      where: {
        created_at: {
          lte: new Date(end).toISOString(),
          gte: new Date(start).toISOString(),
        },
        OR: [
          { status: 'accepted' },
          { status: 'canceled' },
          { status: 'borrowed' },
          { status: 'return req' },
          { status: 'returned' },
        ],
      },
    });

    console.log(findOrderSuccessBorrowingQuery);

    //FOR AREA CHART BOOK SELLING
    const findAllTransactionBookSellingQuery = await prisma.order.findMany({
      where: {
        created_at: {
          lte: new Date(end).toISOString(),
          gte: new Date(start).toISOString(),
        },
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    const groupingDate = {};

    findAllTransactionBookSellingQuery.forEach((transaction) => {
      const transactionDate = new Date(transaction.created_at);
      const convertTransactionDate = groupAnalyticsChart(
        transactionDate,
        filter
      );

      if (!groupingDate[convertTransactionDate]) {
        groupingDate[convertTransactionDate] = {
          bookSelling: 0,
        };
      }

      if (transaction.hasOwnProperty('buy_key')) {
        groupingDate[convertTransactionDate].bookSelling++;
      }
    });

    const data = Object.entries(groupingDate).map(([time, count]) => ({
      time,
      ...count,
    }));

    //FOR AREA CHART BOOK BORROWING
    const findAllTransactionBookBorrowingQuery =
      await prisma.bookBorrowed.findMany({
        where: {
          created_at: {
            lte: new Date(end).toISOString(),
            gte: new Date(start).toISOString(),
          },
        },
        orderBy: {
          created_at: 'asc',
        },
      });

    const groupingDateBorrowing = {};
    findAllTransactionBookBorrowingQuery.forEach((transaction) => {
      const transactionDate = new Date(transaction.created_at);
      const convertTransactionDate = groupAnalyticsChart(
        transactionDate,
        filter
      );

      if (!groupingDateBorrowing[convertTransactionDate]) {
        groupingDateBorrowing[convertTransactionDate] = {
          bookBorrowing: 0,
        };
      }

      if (
        transaction.hasOwnProperty('loan_key') ||
        transaction.hasOwnProperty('returned_key')
      ) {
        groupingDateBorrowing[convertTransactionDate].bookBorrowing++;
      }
    });

    const dataBorrowing = Object.entries(groupingDateBorrowing).map(
      ([time, count]) => ({
        time,
        ...count,
      })
    );

    //FOR TOP 10 BOOKS SELLING TABLE
    const groupSalesBookSellingQuery = await prisma.itemOrder.groupBy({
      by: ['book_title'],
      _sum: {
        quantity: true,
        book_price: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      where: {
        order: {
          status: 'success',
          created_at: {
            lte: new Date(end).toISOString(),
            gte: new Date(start).toISOString(),
          },
        },
      },
      take: 10,
    });

    const dataBookSellingSales = groupSalesBookSellingQuery.map((item) => ({
      quantity: item._sum.quantity,
      book_price: item._sum.book_price,
      book_title: item.book_title,
      calc: item._sum.quantity * item._sum.book_price,
    }));

    //FOR TOP 10 BOOKS BORROWING TABLE
    const groupSalesBookBorrowingQuery = await prisma.itemBorrowed.groupBy({
      by: ['book_title'],
      where: {
        bookBorrowed: {
          status: 'borrowed',
          created_at: {
            lte: new Date(end).toISOString(),
            gte: new Date(start).toISOString(),
          },
        },
      },
      _count: {
        book_title: true,
      },
      orderBy: {
        _count: {
          book_title: 'desc',
        },
      },
      take: 10,
    });

    const dataBookBorrowed = groupSalesBookBorrowingQuery.map((item) => ({
      quantity: item._count.book_title,
      book_title: item.book_title,
    }));

    //FOR TOP 10 STAFF HANDLE BOOKS SELLING
    const groupStaffHandleBookSellingQuery = await prisma.order.groupBy({
      by: ['buy_handled_by'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      where: {
        status: 'success',
        created_at: {
          lte: new Date(end).toISOString(),
          gte: new Date(start).toISOString(),
        },
      },
      take: 10,
    });

    const dataStaffBookSelling = groupStaffHandleBookSellingQuery.map(
      (item) => ({
        staffName: item.buy_handled_by,
        totalHandledSuccess: item._count.id,
      })
    );

    //FOR TOP 10 STAFF HANDLE BOOK LOAN
    const groupLoanHandleStaff = await prisma.bookBorrowed.groupBy({
      by: ['loan_handled_by'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      where: {
        status: 'borrowed',
        created_at: {
          lte: new Date(end).toISOString(),
          gte: new Date(start).toISOString(),
        },
      },
      take: 10,
    });

    const dataStaffBookLoanHandle = groupLoanHandleStaff.map((item) => ({
      staffName: item.loan_handled_by,
      totalLoanHandled: item._count.id,
    }));

    //FOR TOP 10 STAFF HANDLE RETURNING THE BOOK
    const groupReturnedHandleStaff = await prisma.bookBorrowed.groupBy({
      by: ['return_handled_by'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      where: {
        status: 'returned',
        created_at: {
          lte: new Date(end).toISOString(),
          gte: new Date(start).toISOString(),
        },
      },
      take: 10,
    });

    const dataStaffBookReturnHandle = groupReturnedHandleStaff.map((item) => ({
      staffName: item.return_handled_by,
      totalReturnHandled: item._count.id,
    }));

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Dashboard Overview',
      data: {
        pieChart: { bookSellingSuccess: findOrderSuccessQuery },
        areaChart: {
          transactionsBookSelling: data,
          transactionBookBorrowing: dataBorrowing,
        },
        bookSellingSales: dataBookSellingSales,
        dataBookBorrowed,
        staffBookSellingHandle: dataStaffBookSelling,
        staffHandlingLoan: dataStaffBookLoanHandle,
        staffHandlingReturn: dataStaffBookReturnHandle,
      },
    });
  } catch (error) {
    logger.error(`ERROR STAFF Controller dashboard - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

module.exports = { dashboard };
