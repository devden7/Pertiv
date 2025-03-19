const { PrismaClient } = require('@prisma/client');
const logger = require('../../lib/winston/winstonLogger');

const prisma = new PrismaClient();

const AddToCart = async (req, res, next) => {
  try {
    const { book_id } = req.body;
    logger.info(`Controller USER AddToCart - Add Book : ${book_id}`);
    const findBookQuery = await prisma.bookSelling.findUnique({
      where: { id: book_id },
    });

    if (!findBookQuery) {
      const error = new Error('Book not found');
      error.success = false;
      error.statusCode = 404;
      throw error;
    }

    const cart = await prisma.cart.upsert({
      where: { user_id: '6c1827d3-d46f-4f5e-b0fe-d430d2ea57f0' }, // STILL HARD CODED
      update: {},
      create: { user_id: '6c1827d3-d46f-4f5e-b0fe-d430d2ea57f0' }, // STILL HARD CODED
    });

    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        cart_id_book_selling_id: {
          cart_id: cart.id,
          book_selling_id: book_id,
        },
      },
    });

    if (existingCartItem) {
      const updatedCartItem = await prisma.cartItem.update({
        where: {
          cart_id_book_selling_id: {
            cart_id: cart.id,
            book_selling_id: book_id,
          },
        },
        data: {
          quantity: existingCartItem.quantity + 1,
        },
      });
      logger.info(
        `Controller USER AddToCart - Cart Item Updated: ${updatedCartItem}`
      );
    } else {
      const newCartItem = await prisma.cartItem.create({
        data: {
          quantity: 1,
          cart_id: cart.id,
          book_selling_id: book_id,
        },
      });
      logger.info(
        `Controller USER AddToCart - cart Item Added: ${newCartItem}`
      );
    }
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'The book has been added to cart successfully.',
    });
  } catch (error) {
    logger.error(`ERROR USER Controller AddToCart - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

module.exports = {
  AddToCart,
};
