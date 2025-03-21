const { PrismaClient } = require('@prisma/client');
const logger = require('../../lib/winston/winstonLogger');
const generateOrderId = require('../../utils/randomOrderId');
const endDate24Hours = require('../../utils/createEndDateTime');

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

module.exports = {
  createOrderBook,
};
