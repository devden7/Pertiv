const { formatISO } = require('date-fns/formatISO');
const logger = require('../../lib/winston/winstonLogger');
const prisma = require('../../utils/prismaConnection');
const generateLoanKey = require('../../utils/randomLoanKey');
const { endDateBorrowed } = require('../../utils/createEndDateTime');
const { addDays } = require('date-fns');

const transactions = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const LIMIT = 10;
    const skip = (page - 1) * LIMIT;
    const keyword = search
      ? {
          OR: [
            {
              user: {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
            {
              id: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              item_orders: {
                some: {
                  book_title: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              },
            },
          ],
        }
      : {};

    logger.info(`Controller STAFF transactions -  User ID : ${id}`);
    const findOrderQuery = await prisma.order.findMany({
      skip,
      take: LIMIT,
      orderBy: {
        created_at: 'desc',
      },
      where: keyword,
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
        item_orders: true,
      },
    });

    if (!findOrderQuery) {
      const error = new Error('Orders History not found');
      error.success = false;
      error.statusCode = 404;
      throw error;
    }
    const data = findOrderQuery.map((item) => ({
      id: item.id,
      status: item.status,
      buy_key: item.buy_key,
      buy_handled_by: item.buy_handled_by,
      buy_date: item.buy_date,
      total_price: item.total_price,
      created_at: item.created_at,
      ended_at: item.ended_at,
      canceled_at: item.canceled_at,
      paid_at: item.paid_at,
      userId: item.userId,
      user: item.user,
      item_order: item.item_orders.map((order) => ({
        id: order.id,
        book_title: order.book_title,
        book_imageUrl: order.book_imageUrl,
        book_price: order.book_price,
        quantity: order.quantity,
      })),
    }));

    const countOrder = await prisma.order.count({
      where: keyword,
    });
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Access transaction history',
      data,
      totalCount: countOrder,
    });
  } catch (error) {
    logger.error(`ERROR STAFF Controller transactions - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const transactionDetail = async (req, res, next) => {
  const paramsId = req.params.id;
  logger.info(`Controller STAFF transactionDetail `);
  try {
    const findOrderQuery = await prisma.order.findUnique({
      where: { id: `#${paramsId}` },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        item_orders: {
          select: {
            id: true,
            book_title: true,
            book_imageUrl: true,
            book_price: true,
            quantity: true,
          },
        },
      },
    });

    if (!findOrderQuery) {
      const error = new Error('Order not found');
      error.success = false;
      error.statusCode = 404;
      throw error;
    }

    // Mengirim data yang diinginkan
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        id: findOrderQuery.id,
        status: findOrderQuery.status,
        buy_key: findOrderQuery.buy_key,
        buy_handled_by: findOrderQuery.buy_handled_by,
        buy_date: findOrderQuery.buy_date,
        total_price: findOrderQuery.total_price,
        created_at: findOrderQuery.created_at,
        ended_at: findOrderQuery.ended_at,
        canceled_at: findOrderQuery.canceled_at,
        paid_at: findOrderQuery.paid_at,
        userId: findOrderQuery.userId,
        user: findOrderQuery.user,
        item_order: findOrderQuery.item_orders,
      },
    });
  } catch (error) {
    logger.error(`ERROR STAFF Controller transactionDetail - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const confirmOrder = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { keyValue } = req.body;
    logger.info(`Controller STAFF confirmOrder -  Staff ID : ${id}`);

    const findStaffQuery = await prisma.user.findUnique({
      where: {
        id,
        role: 'staff',
      },
    });

    if (!findStaffQuery) {
      const error = new Error('Staff not found');
      error.success = false;
      error.statusCode = 404;
      throw error;
    }

    const findOrderQuery = await prisma.order.findUnique({
      where: {
        buy_key: `#${keyValue}`,
        status: 'paid',
      },
    });

    if (!findOrderQuery) {
      const error = new Error('invalid Order');
      error.success = false;
      error.statusCode = 400;
      throw error;
    }

    await prisma.order.update({
      where: {
        id: findOrderQuery.id,
        status: findOrderQuery.status,
      },
      data: {
        status: 'success',
        buy_handled_by: findStaffQuery.email,
        buy_date: formatISO(new Date()),
      },
    });
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Successfully confirm order',
    });
  } catch (error) {
    logger.error(`ERROR STAFF Controller confirmOrder - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const borrowtransactions = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const LIMIT = 10;
    const skip = (page - 1) * LIMIT;
    const keyword = search
      ? {
          OR: [
            {
              user: {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
            {
              id: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              items: {
                some: {
                  book_title: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              },
            },
          ],
        }
      : {};

    logger.info(`Controller STAFF borrowtransactions -  User ID : ${id}`);
    const findBorrowQuery = await prisma.bookBorrowed.findMany({
      skip,
      take: LIMIT,
      orderBy: {
        created_at: 'desc',
      },
      where: keyword,
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
        items: true,
      },
    });

    const data = findBorrowQuery.map((item) => ({
      id: item.id,
      status: item.status,
      loan_key: item.loan_key,
      loan_handled_by: item.loan_handled_by,
      loan_date: item.loan_date,
      created_at: item.created_at,
      ended_at: item.ended_at,
      canceled_at: item.canceled_at,
      return_handled_by: item.return_handled_by,
      date_returned: item.date_returned,
      returned_key: item.returned_key,
      userId: item.userId,
      user: item.user,
      items: item.items.map((order) => ({
        id: order.id,
        book_title: order.book_title,
        book_imageUrl: order.book_imageUrl,
      })),
    }));

    const countBorrow = await prisma.bookBorrowed.count({
      where: keyword,
    });
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Access transaction history',
      data,
      totalCount: countBorrow,
    });
  } catch (error) {
    logger.error(`ERROR STAFF Controller borrowtransactions - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const borrowtransactionDetail = async (req, res, next) => {
  const paramsId = req.params.id;
  logger.info(`Controller STAFF borrowtransactionDetail `);
  try {
    const findOrderQuery = await prisma.bookBorrowed.findUnique({
      where: { id: `#${paramsId}` },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          select: {
            id: true,
            book_title: true,
            book_imageUrl: true,
          },
        },
      },
    });

    if (!findOrderQuery) {
      const error = new Error('BookBorrowed not found');
      error.success = false;
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: findOrderQuery,
    });
  } catch (error) {
    logger.error(`ERROR STAFF Controller borrowtransactionDetail - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const acceptLoanBook = async (req, res, next) => {
  try {
    const paramsId = req.params.id;
    logger.info(`Controller USER acceptLoanBook -  Borrow ID : ${paramsId}  `);
    const findOrderQuery = await prisma.bookBorrowed.findUnique({
      where: {
        id: `#${paramsId}`,
      },
    });

    if (!findOrderQuery) {
      const error = new Error('Book borrowed not found');
      error.success = false;
      error.statusCode = 404;
      throw error;
    }

    if (findOrderQuery.status !== 'pending') {
      const error = new Error('Book borrowed is not valid');
      error.success = false;
      error.statusCode = 400;
      throw error;
    }
    await prisma.bookBorrowed.update({
      where: {
        id: `#${paramsId}`,
      },
      data: {
        status: 'accepted',
        loan_key: generateLoanKey(),
      },
    });
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Borrowed successfully',
    });
  } catch (error) {
    logger.error(`ERROR USER Controller acceptLoanBook - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const rejectLoanBook = async (req, res, next) => {
  try {
    const paramsId = req.params.id;
    logger.info(`Controller USER rejectLoanBook -  Borrow ID : ${paramsId}  `);

    const findOrderQuery = await prisma.bookBorrowed.findUnique({
      where: {
        id: `#${paramsId}`,
      },
      include: {
        items: true,
      },
    });

    if (!findOrderQuery) {
      const error = new Error('Book borrowed not found');
      error.success = false;
      error.statusCode = 404;
      throw error;
    }

    if (findOrderQuery.status !== 'pending') {
      const error = new Error('Book borrowed is not valid');
      error.success = false;
      error.statusCode = 400;
      throw error;
    }
    await prisma.bookBorrowed.update({
      where: {
        id: `#${paramsId}`,
      },
      data: {
        status: 'canceled',
        canceled_at: formatISO(new Date()),
      },
    });

    for (const item of findOrderQuery.items) {
      await prisma.bookBorrowing.update({
        where: { id: item.book_borrowing_id },
        data: {
          stock: {
            increment: 1,
          },
        },
      });
    }
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Reject book borrowed successfully',
    });
  } catch (error) {
    logger.error(`ERROR USER Controller rejectLoanBook - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const confirmLoan = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { keyValue } = req.body;
    logger.info(`Controller STAFF confirmLoan -  Staff ID : ${id}`);

    const findStaffQuery = await prisma.user.findUnique({
      where: {
        id,
        role: 'staff',
      },
    });

    if (!findStaffQuery) {
      const error = new Error('Staff not found');
      error.success = false;
      error.statusCode = 404;
      throw error;
    }

    const findBookBorrowedQuery = await prisma.bookBorrowed.findUnique({
      where: {
        loan_key: `#${keyValue}`,
        status: 'accepted',
      },
      include: {
        items: {
          include: {
            book_borrowing: true,
          },
        },
      },
    });

    if (!findBookBorrowedQuery) {
      const error = new Error('invalid loan transaction');
      error.success = false;
      error.statusCode = 400;
      throw error;
    }

    const findUserMembership = await prisma.membershipTransaction.findMany({
      where: {
        user_id: findBookBorrowedQuery.userId,
      },
      orderBy: {
        start_date: 'desc',
      },
    });

    const checkMaxReturnedBook =
      findUserMembership.length > 0 ? findUserMembership[0].maxReturn : 14;

    await prisma.bookBorrowed.update({
      where: {
        id: findBookBorrowedQuery.id,
        status: findBookBorrowedQuery.status,
      },
      data: {
        status: 'borrowed',
        loan_handled_by: findStaffQuery.email,
        loan_date: formatISO(new Date()),
        ended_at: endDateBorrowed(checkMaxReturnedBook),
      },
    });
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Successfully confirm loan',
    });
  } catch (error) {
    logger.error(`ERROR STAFF Controller confirmLoan - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const confirmReturnBook = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { keyValue } = req.body;
    logger.info(`Controller STAFF confirmReturned -  Staff ID : ${id}`);

    const findStaffQuery = await prisma.user.findUnique({
      where: {
        id,
        role: 'staff',
      },
    });

    if (!findStaffQuery) {
      const error = new Error('Staff not found');
      error.success = false;
      error.statusCode = 404;
      throw error;
    }

    const findBookBorrowedQuery = await prisma.bookBorrowed.findUnique({
      where: {
        returned_key: `#${keyValue}`,
        status: 'return req',
      },
    });

    if (!findBookBorrowedQuery) {
      const error = new Error('invalid returned transaction');
      error.success = false;
      error.statusCode = 400;
      throw error;
    }
    const dateNow = formatISO(new Date());
    const dateDueReturn = formatISO(findBookBorrowedQuery.ended_at);

    if (dateNow > dateDueReturn) {
      await prisma.penalty.create({
        data: {
          price: 5000,
          type: 'active',
          start_date: formatISO(new Date()),
          end_date: formatISO(addDays(new Date(), 3)),
          borrowed_id: findBookBorrowedQuery.id,
        },
      });
    }

    await prisma.bookBorrowed.update({
      where: {
        id: findBookBorrowedQuery.id,
        status: findBookBorrowedQuery.status,
      },
      data: {
        status: 'returned',
        return_handled_by: findStaffQuery.email,
        date_returned: formatISO(new Date()),
      },
    });
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Book successfully returned',
    });
  } catch (error) {
    logger.error(`ERROR STAFF Controller confirmReturned - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

module.exports = {
  transactions,
  confirmOrder,
  borrowtransactions,
  borrowtransactionDetail,
  acceptLoanBook,
  rejectLoanBook,
  confirmLoan,
  confirmReturnBook,
  transactionDetail,
};
