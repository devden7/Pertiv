const prisma = require('../../utils/prismaConnection');

const pieChartBookSelling = async (start, end) => {
  return await prisma.order.count({
    where: {
      created_at: {
        lte: new Date(end).toISOString(),
        gte: new Date(start).toISOString(),
      },
      status: 'success',
    },
  });
};

const pieChartBookBorrowing = async (start, end) => {
  return await prisma.bookBorrowed.count({
    where: {
      created_at: {
        lte: new Date(end).toISOString(),
        gte: new Date(start).toISOString(),
      },
      status: 'borrowed',
    },
  });
};

const areaChartSelling = async (start, end, filter) => {
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
    const convertTransactionDate = groupAnalyticsChart(transactionDate, filter);

    if (!groupingDate[convertTransactionDate]) {
      groupingDate[convertTransactionDate] = {
        bookSelling: 0,
      };
    }

    if (transaction.hasOwnProperty('buy_key')) {
      groupingDate[convertTransactionDate].bookSelling++;
    }
  });

  return Object.entries(groupingDate).map(([time, count]) => ({
    time,
    ...count,
  }));
};

const areaChartBorrowing = async (start, end, filter) => {
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
    const convertTransactionDate = groupAnalyticsChart(transactionDate, filter);

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

  return Object.entries(groupingDateBorrowing).map(([time, count]) => ({
    time,
    ...count,
  }));
};

const topTenBookSelling = async (start, end) => {
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

  const data = groupSalesBookSellingQuery.map((item) => ({
    quantity: item._sum.quantity,
    book_price: item._sum.book_price,
    book_title: item.book_title,
    calc: item._sum.quantity * item._sum.book_price,
  }));

  return data;
};

const topTenBookBorrowing = async (start, end) => {
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

  return groupSalesBookBorrowingQuery.map((item) => ({
    quantity: item._count.book_title,
    book_title: item.book_title,
  }));
};

const topTenStaffHandlingSelling = async (start, end) => {
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

  return groupStaffHandleBookSellingQuery.map((item) => ({
    staffName: item.buy_handled_by,
    totalHandledSuccess: item._count.id,
  }));
};

const topTenStaffHandlingLoan = async (start, end) => {
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

  return groupLoanHandleStaff.map((item) => ({
    staffName: item.loan_handled_by,
    totalLoanHandled: item._count.id,
  }));
};

const topTenStaffHandlingReturn = async (start, end) => {
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

  return groupReturnedHandleStaff.map((item) => ({
    staffName: item.return_handled_by,
    totalReturnHandled: item._count.id,
  }));
};
const pieChart = async (start, end) => {
  const bookSellingSuccess = await pieChartBookSelling(start, end);
  const bookBorrowingSuccess = await pieChartBookBorrowing(start, end);

  return {
    bookSellingSuccess,
    bookBorrowingSuccess,
  };
};
const areaChart = async (start, end, filter) => {
  const transactionsBookSelling = await areaChartSelling(start, end, filter);
  const transactionBookBorrowing = await areaChartBorrowing(start, end, filter);
  return { transactionsBookSelling, transactionBookBorrowing };
};

const topTenBook = async (start, end) => {
  const topTenBookSelling = await topTenBookSelling(start, end);
  console.log(bookSellingSales, 'TOPTENNNN');
  const topTenBookBorrowing = await topTenBookBorrowing(start, end);
  return { topTenBookSelling, topTenBookBorrowing };
};

const topTenStaff = async (start, end) => {
  const topStaffHandlingSelling = await topTenStaffHandlingSelling(start, end);
  const topStaffHandlingLoan = await topTenStaffHandlingLoan(start, end);
  const topStaffHandlingReturn = await topTenStaffHandlingReturn(start, end);

  return {
    topStaffHandlingSelling,
    topStaffHandlingLoan,
    topStaffHandlingReturn,
  };
};

module.exports = {
  pieChart,
  areaChart,
  topTenBook,
  topTenStaff,
};
