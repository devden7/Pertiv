const logger = require('../../lib/winston/winstonLogger');
const generateOrderId = require('../../utils/randomOrderId');
const generateBorrowId = require('../../utils/randomBorrowId');
const { endDate24Hours } = require('../../utils/createEndDateTime');
const { formatISO } = require('date-fns');
const generateOrderKey = require('../../utils/randomOrderKey');
const prisma = require('../../utils/prismaConnection');
const generateReturnedBooknKey = require('../../utils/randomReturnedBookKey');

const createOrderBook = async (req, res, next) => {
  try {
    const { cartItem } = req.body;
    const { id } = req.user;
    const findBooksSellingQuery = await prisma.bookSelling.findMany({
      where: { id: { in: cartItem.map((item) => item.book_id) } },
    });

    if (findBooksSellingQuery.length === 0) {
      const error = new Error('Book not found');
      error.success = false;
      error.statusCode = 404;
      throw error;
    }

    for (let i = 0; i < cartItem.length; i++) {
      const book = findBooksSellingQuery.find(
        (item) => item.id === cartItem[i].book_id
      );
      if (book.stock < cartItem[i].quantity) {
        const error = new Error('Out of stock!');
        error.success = false;
        error.statusCode = 400;
        throw error;
      }
    }

    const totalPrice = cartItem.reduce((acc, item) => {
      const book = findBooksSellingQuery.find((b) => b.id === item.book_id);
      return book ? acc + book.price * item.quantity : acc;
    }, 0);

    const orderQuery = await prisma.order.create({
      data: {
        id: generateOrderId(),
        userId: id,
        status: 'pending',
        total_price: totalPrice,
        ended_at: endDate24Hours(),
        item_orders: {
          create: cartItem.map((item) => {
            const book = findBooksSellingQuery.find(
              (b) => b.id === item.book_id
            );
            return {
              book_title: book.title,
              book_description: book.description,
              book_imageUrl: book.imageUrl,
              book_price: book.price,
              quantity: parseInt(item.quantity),
              book_selling_id: book.id,
            };
          }),
        },
      },
      include: {
        item_orders: true,
      },
    });

    for (const item of cartItem) {
      await prisma.bookSelling.update({
        where: { id: item.book_id },
        data: {
          stock: {
            decrement: parseInt(item.quantity),
          },
        },
      });
    }

    await prisma.cartItem.deleteMany({
      where: {
        book_selling_id: { in: findBooksSellingQuery.map((item) => item.id) },
      },
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Order created successfully.',
      data: { id: orderQuery.id },
    });
  } catch (error) {
    logger.error(`ERROR USER Controller CreateOrderBook - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const paymentBookDetail = async (req, res, next) => {
  try {
    const paramsId = req.params.id;
    const { id } = req.user;

    logger.info(
      `Controller USER paymentBookDetail -  Order ID : ${paramsId}  User ID : ${id}`
    );

    let findOrderQuery = await prisma.order.findUnique({
      where: {
        id: `#${paramsId}`,
        userId: id,
      },
      include: {
        item_orders: true,
      },
    });

    if (!findOrderQuery) {
      const error = new Error('Order not found');
      error.success = false;
      error.statusCode = 404;
      throw error;
    }

    const dateNow = formatISO(new Date());
    const dueDate = formatISO(findOrderQuery.ended_at);

    if (dateNow >= dueDate && findOrderQuery.status !== 'success') {
      findOrderQuery = await prisma.order.update({
        where: {
          id: `#${paramsId}`,
          userId: id,
          status: 'pending',
        },
        data: {
          status: 'canceled',
          canceled_at: dueDate,
        },
        include: {
          item_orders: true,
        },
      });
    }

    const data = {
      id: findOrderQuery.id,
      status: findOrderQuery.status,
      total_price: findOrderQuery.total_price,
      created_at: findOrderQuery.created_at,
      ended_at: findOrderQuery.ended_at,
      item_Order: findOrderQuery.item_orders.map((item) => ({
        id: item.id,
        book_title: item.book_title,
        book_imageUrl: item.book_imageUrl,
        book_price: item.book_price,
        quantity: item.quantity,
      })),
    };

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Success get payment detail of the order',
      data,
    });
  } catch (error) {
    logger.error(`ERROR USER Controller paymentBookDetail - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const purchaseBook = async (req, res, next) => {
  try {
    const paramsId = req.params.id;
    const { id } = req.user;
    logger.info(
      `Controller USER purchaseBook -  Order ID : ${paramsId}  User ID : ${id}`
    );
    const findOrderQuery = await prisma.order.findUnique({
      where: {
        id: `#${paramsId}`,
        userId: id,
      },
      include: {
        item_orders: {
          include: {
            book_selling: true,
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
    const dateNow = formatISO(new Date());
    const dueDate = formatISO(findOrderQuery.ended_at);

    if (dateNow >= dueDate) {
      await prisma.order.update({
        where: {
          id: `#${paramsId}`,
          userId: id,
        },
        data: {
          status: 'canceled',
          canceled_at: dueDate,
        },
      });

      const error = new Error('Order is not valid');
      error.success = false;
      error.statusCode = 400;
      throw error;
    }

    if (findOrderQuery.status !== 'pending') {
      const error = new Error('Order is not valid');
      error.success = false;
      error.statusCode = 400;
      throw error;
    }

    // Check stock berfore purchase
    for (let i = 0; i < findOrderQuery.item_orders.length; i++) {
      const book = findOrderQuery.item_orders[i].book_selling;
      if (book.stock < findOrderQuery.item_orders[i].quantity) {
        const error = new Error('Out of stock!');
        error.success = false;
        error.statusCode = 400;
        throw error;
      }
    }

    await prisma.order.update({
      where: {
        id: `#${paramsId}`,
        userId: id,
      },
      data: {
        status: 'paid',
        buy_key: generateOrderKey(),
        paid_at: formatISO(new Date()),
      },
    });
    res.json({
      success: true,
      statusCode: 201,
      message: 'Your payment is successfully',
    });
  } catch (error) {
    logger.error(`ERROR USER Controller purchaseBook - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const cancelPurchaseBook = async (req, res, next) => {
  try {
    const paramsId = req.params.id;
    const { id } = req.user;
    logger.info(
      `Controller USER cancelPurchaseBook -  Order ID : ${paramsId}  User ID : ${id}`
    );
    const findOrderQuery = await prisma.order.findUnique({
      where: {
        id: `#${paramsId}`,
        userId: id,
      },
      include: {
        item_orders: true,
      },
    });

    if (!findOrderQuery) {
      const error = new Error('Order not found');
      error.success = false;
      error.statusCode = 404;
      throw error;
    }

    const dateNow = formatISO(new Date());
    const dueDate = formatISO(findOrderQuery.ended_at);

    if (dateNow >= dueDate) {
      await prisma.order.update({
        where: {
          id: `#${paramsId}`,
          userId: id,
        },
        data: {
          status: 'canceled',
          canceled_at: dueDate,
        },
      });
    }

    if (
      findOrderQuery.status === 'canceled' ||
      findOrderQuery.status === 'paid'
    ) {
      const error = new Error('Order is not valid');
      error.success = false;
      error.statusCode = 400;
      throw error;
    }

    await prisma.order.update({
      where: {
        id: `#${paramsId}`,
        userId: id,
      },
      data: {
        status: 'canceled',
        canceled_at: formatISO(new Date()),
      },
    });

    for (const item of findOrderQuery.item_orders) {
      await prisma.bookSelling.update({
        where: { id: item.book_selling_id },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });
    }
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Your payment is cancelled',
    });
  } catch (error) {
    logger.error(`ERROR USER Controller cancelPurchaseBook - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const transactions = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const LIMIT = 10;
    const skip = (page - 1) * LIMIT;

    const keyword = search
      ? {
          AND: [
            {
              userId: id,
            },
            {
              id: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }
      : { userId: id };

    logger.info(`Controller USER transactions -  User ID : ${id}`);
    const findOrderQuery = await prisma.order.findMany({
      where: keyword,
      skip,
      take: LIMIT,
      orderBy: { created_at: 'desc' },
      include: {
        item_orders: true,
      },
    });

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
      item_Order: item.item_orders.map((order) => ({
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
    logger.error(`ERROR USER Controller transactions - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const createBorrowBook = async (req, res, next) => {
  try {
    const { collectionItems } = req.body;

    const { id } = req.user;

    logger.info(
      `Controller USER createBorrowBook -  User ID : ${id} & Collection Item : ${JSON.stringify(
        collectionItems
      )}`
    );

    const findBooksBorrowingQuery = await prisma.bookBorrowing.findMany({
      where: { id: { in: collectionItems.map((item) => item.book_id) } },
    });

    //handling if book not found
    if (findBooksBorrowingQuery.length === 0) {
      const error = new Error('Book not found');
      error.success = false;
      error.statusCode = 404;
      throw error;
    }

    const calcBorrowedUser = await prisma.itemBorrowed.findMany({
      where: {
        bookBorrowed: {
          userId: id,
          OR: [
            { status: 'pending' },
            { status: 'accepted' },
            { status: 'borrowed' },
            { status: 'return req' },
          ],
        },
      },
      include: {
        bookBorrowed: true,
      },
    });

    const findUserMembership = await prisma.membershipTransaction.findMany({
      where: {
        user_id: id,
      },
    });

    //handling max borrowed book (member premium 5 books and non member 2 books)
    if (findUserMembership.length > 0) {
      const dateNow = formatISO(new Date());
      const endDate = formatISO(findUserMembership[0].end_date);
      if (endDate > dateNow) {
        if (calcBorrowedUser.length + findBooksBorrowingQuery.length > 5) {
          const error = new Error('A maximum of 5 books can be borrowed');
          error.success = false;
          error.statusCode = 400;
          throw error;
        }
      }
    } else {
      if (calcBorrowedUser.length + findBooksBorrowingQuery.length > 2) {
        const error = new Error('A maximum of 2 books can be borrowed');
        error.success = false;
        error.statusCode = 400;
        throw error;
      }
    }

    const duplicateBookBorrow = collectionItems.filter(
      (book, index, self) =>
        self.findIndex((item) => item.book_id === book.book_id) !== index
    );

    //handling if user borrow the same book
    if (duplicateBookBorrow.length > 0) {
      const error = new Error('You will not be able to borrow the same book.');
      error.success = false;
      error.statusCode = 400;
      throw error;
    }

    const existingBorrow = await prisma.itemBorrowed.findMany({
      where: {
        book_borrowing_id: {
          in: findBooksBorrowingQuery.map((item) => item.id),
        },
        bookBorrowed: {
          AND: [
            {
              OR: [
                { status: 'pending' },
                { status: 'accepted' },
                { status: 'borrowed' },
                { status: 'return req' },
              ],
            },
            { userId: id },
          ],
        },
      },
    });

    //handling if user already borrow the same book
    if (existingBorrow.length > 0) {
      const error = new Error('You have already borrowed this book.');
      error.success = false;
      error.statusCode = 400;
      throw error;
    }
    const findPenaltyQuery = await prisma.bookBorrowed.findFirst({
      where: {
        userId: id,
        penalty: {
          type: 'active',
        },
      },
      orderBy: {
        penalty: {
          start_date: 'desc',
        },
      },
    });

    //handling if user have an active penalty
    if (findPenaltyQuery > 0) {
      const dateNow = formatISO(new Date());
      const dateDueReturn = formatISO(findPenaltyQuery.ended_at);
      if (dateDueReturn > dateNow) {
        const error = new Error('Your account have an active penalty.');
        error.success = false;
        error.statusCode = 400;
        throw error;
      }
    }

    const borrowQuantity = 1;
    for (let i = 0; i < collectionItems.length; i++) {
      const book = findBooksBorrowingQuery.find(
        (item) => item.id === collectionItems[i].book_id
      );
      if (book.stock < borrowQuantity) {
        const error = new Error('Out of stock!');
        error.success = false;
        error.statusCode = 400;
        throw error;
      }
    }

    await prisma.bookBorrowed.create({
      data: {
        id: generateBorrowId(),
        userId: id,
        status: 'pending',
        items: {
          create: collectionItems.map((item) => {
            const book = findBooksBorrowingQuery.find(
              (b) => b.id === item.book_id
            );
            return {
              book_title: book.title,
              book_description: book.description,
              book_imageUrl: book.imageUrl,
              book_borrowing_id: book.id,
            };
          }),
        },
      },
      include: {
        items: true,
      },
    });

    await prisma.collectionItem.deleteMany({
      where: {
        book_id: { in: findBooksBorrowingQuery.map((item) => item.id) },
      },
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Borrowed book successfully.',
    });
  } catch (error) {
    logger.error(`ERROR USER Controller createBorrowBook - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const borrowTransactions = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const LIMIT = 10;
    const skip = (page - 1) * LIMIT;

    const keyword = search
      ? {
          AND: [
            {
              userId: id,
            },
            {
              id: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }
      : { userId: id };

    logger.info(`Controller USER borrowTransactions -  User ID : ${id}`);

    const findBorrowQuery = await prisma.bookBorrowed.findMany({
      where: keyword,
      skip,
      take: LIMIT,
      orderBy: { created_at: 'desc' },
      include: {
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
      items: item.items.map((order) => ({
        id: order.id,
        book_title: order.book_title,
        book_imageUrl: order.book_imageUrl,
      })),
    }));

    const countBorrowed = await prisma.bookBorrowed.count({
      where: keyword,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Access transaction history',
      data,
      totalCount: countBorrowed,
    });
  } catch (error) {
    logger.error(`ERROR USER Controller borrowTransactions - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const bookReturnRequested = async (req, res, next) => {
  try {
    const paramsId = req.params.id;
    logger.info(`Controller USER returnRequested -  Borrow ID : ${paramsId}  `);
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

    if (findOrderQuery.status !== 'borrowed') {
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
        status: 'return req',
        returned_key: generateReturnedBooknKey(),
      },
    });
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Return requested successfully',
    });
  } catch (error) {
    logger.error(`ERROR USER Controller returnRequested - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

module.exports = {
  createOrderBook,
  paymentBookDetail,
  purchaseBook,
  cancelPurchaseBook,
  transactions,
  createBorrowBook,
  borrowTransactions,
  bookReturnRequested,
};
