const { PrismaClient } = require('@prisma/client');
const logger = require('../../lib/winston/winstonLogger');
const generateOrderId = require('../../utils/randomOrderId');
const endDate24Hours = require('../../utils/createEndDateTime');
const { formatISO } = require('date-fns');
const generateOrderKey = require('../../utils/randomOrderKey');

const prisma = new PrismaClient();

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
        },
        data: {
          status: 'canceled',
          canceled_at: dueDate,
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
    const id = '39ec9e8a-76ef-4d4b-a686-896765a87427';
    logger.info(
      `ERROR USER Controller purchaseBook -  Order ID : ${paramsId}  User ID : ${id}`
    );
    const findOrderQuery = await prisma.order.findUnique({
      where: {
        id: `#${paramsId}`,
        userId: id,
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
        status: 'paid',
        buy_key: generateOrderKey(),
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

module.exports = {
  createOrderBook,
  paymentBookDetail,
  purchaseBook,
};
