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

const getCartList = async (req, res, next) => {
  try {
    logger.info(`Controller USER GetCartList - Cart: `);
    const cart = await prisma.cart.findUnique({
      where: { user_id: '6c1827d3-d46f-4f5e-b0fe-d430d2ea57f0' }, // STILL HARD CODED
      include: {
        cart_items: {
          include: {
            book_selling: {
              select: {
                title: true,
                description: true,
                language: true,
                stock: true,
                imageUrl: true,
                price: true,
                created_at: true,
              },
            },
          },
        },
      },
    });

    const finalCart = {
      user_id: cart.user_id,
      cart_items: cart.cart_items.map((item) => ({
        id: item.book_selling_id,
        quantity: item.quantity,
        title: item.book_selling.title,
        description: item.book_selling.description,
        language: item.book_selling.language,
        stock: item.book_selling.stock,
        imageUrl: item.book_selling.imageUrl,
        price: item.book_selling.price,
        created_at: item.book_selling.created_at,
      })),
    };

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Cart Items fetched successfully.',
      data: finalCart,
    });
  } catch (error) {
    logger.error(`ERROR USER Controller GetCartList - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const removeItemFromCart = async (req, res, next) => {
  try {
    const { book_id } = req.body;
    logger.info(
      `Controller USER removeItemFromCart - Remove Book : ${book_id}`
    );
    const findBookQuery = await prisma.bookSelling.findUnique({
      where: { id: book_id },
    });

    if (!findBookQuery) {
      const error = new Error('Book not found');
      error.success = false;
      error.statusCode = 404;
      throw error;
    }

    const cart = await prisma.cart.findUnique({
      where: { user_id: '6c1827d3-d46f-4f5e-b0fe-d430d2ea57f0' }, // STILL HARD CODED
    });

    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        cart_id_book_selling_id: {
          cart_id: cart.id,
          book_selling_id: book_id,
        },
      },
    });

    if (!existingCartItem) {
      const error = new Error('Cart Item not found');
      error.success = false;
      error.statusCode = 404;
      throw error;
    }

    await prisma.cartItem.delete({
      where: {
        cart_id_book_selling_id: {
          cart_id: cart.id,
          book_selling_id: book_id,
        },
      },
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'The book has been removed from cart successfully.',
    });
  } catch (error) {
    logger.error(`ERROR USER Controller removeItemFromCart - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const decreaseItemFromCart = async (req, res, next) => {
  try {
    const { book_id } = req.body;
    logger.info(
      `Controller USER decreaseItemFromCart - Remove Book : ${book_id}`
    );
    const findBookQuery = await prisma.bookSelling.findUnique({
      where: { id: book_id },
    });

    if (!findBookQuery) {
      const error = new Error('Book not found');
      error.success = false;
      error.statusCode = 404;
      throw error;
    }

    const cart = await prisma.cart.findUnique({
      where: { user_id: '6c1827d3-d46f-4f5e-b0fe-d430d2ea57f0' }, // STILL HARD CODED
    });

    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        cart_id_book_selling_id: {
          cart_id: cart.id,
          book_selling_id: book_id,
        },
      },
    });

    if (!existingCartItem) {
      const error = new Error('Cart Item not found');
      error.success = false;
      error.statusCode = 404;
      throw error;
    }

    if (existingCartItem.quantity === 1) {
      await prisma.cartItem.delete({
        where: {
          cart_id_book_selling_id: {
            cart_id: cart.id,
            book_selling_id: book_id,
          },
        },
      });
    } else {
      await prisma.cartItem.update({
        where: {
          cart_id_book_selling_id: {
            cart_id: cart.id,
            book_selling_id: book_id,
          },
        },
        data: {
          quantity: existingCartItem.quantity - 1,
        },
      });
    }

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'The book has been decreased from cart successfully.',
    });
  } catch (error) {
    logger.error(`ERROR USER Controller decreaseItemFromCart - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};
module.exports = {
  AddToCart,
  getCartList,
  removeItemFromCart,
  decreaseItemFromCart,
};
