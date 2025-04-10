const logger = require('../../lib/winston/winstonLogger');
const prisma = require('../../utils/prismaConnection');

const getBookListSelling = async (req, res, next) => {
  try {
    logger.info(
      'Controller getBookListSelling - Get all book selling for user'
    );
    const take = req.query.limit ? parseInt(req.query.limit, 10) : undefined;

    const booksSellingQuery = await prisma.bookSelling.findMany({
      take: take,
      orderBy: {
        created_at: 'desc',
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
        publisher: {
          select: {
            name: true,
          },
        },
        writer: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            categories: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        item_orders: {
          include: {
            order: {
              select: {
                status: true,
              },
            },
          },
        },
      },
    });

    const finalResults = booksSellingQuery.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      language: item.language,
      stock: item.stock,
      imageUrl: item.imageUrl,
      price: item.price,
      created_at: item.created_at,
      user_id: item.user_id,
      publisher_id: item.publisher_id,
      writer_id: item.writer_id,
      user: item.user,
      publisher: item.publisher,
      writer: item.writer,
      category: item.category,
      totalItemSold: item.item_orders
        .map((list) => ({
          quantity: list.quantity,
          order: list.order,
        }))
        .filter((value) => value.order.status === 'success')
        .reduce((acc, item) => acc + item.quantity, 0),
    }));

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: finalResults,
    });
  } catch (error) {
    logger.error(`ERROR Controller getBookListSelling for user  -  ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const getBookSellingDetail = async (req, res, next) => {
  try {
    const paramsId = req.params.id;

    logger.info(
      `Controller USER getBookSellingDetail - Get detail books selling ID : ${paramsId}`
    );

    const bookSellingQuery = await prisma.bookSelling.findUnique({
      where: { id: paramsId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        publisher: {
          select: {
            name: true,
          },
        },
        writer: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            categories: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!bookSellingQuery) {
      const error = new Error('Book Selling not found');
      error.success = false;
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: bookSellingQuery,
    });
  } catch (error) {
    logger.error(`ERROR Controller USER getBookSellingDetail - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const getBookListBorrowing = async (req, res, next) => {
  try {
    logger.info(
      'Controller getBookListBorrowing - Get all book selling for user'
    );
    const take = req.query.limit ? parseInt(req.query.limit, 10) : undefined;

    const data = await prisma.bookBorrowing.findMany({
      take: take,
      orderBy: {
        created_at: 'desc',
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
        publisher: {
          select: {
            name: true,
          },
        },
        writer: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            categories: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        items: {
          include: {
            bookBorrowed: {
              select: {
                status: true,
              },
            },
          },
        },
      },
    });

    const finalResults = data.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      language: item.language,
      stock: item.stock,
      imageUrl: item.imageUrl,
      book_position: item.book_position,
      is_member: item.is_member,
      created_at: item.created_at,
      user_id: item.user_id,
      publisher_id: item.publisher_id,
      writer_id: item.writer_id,
      user: item.user,
      publisher: item.publisher,
      writer: item.writer,
      category: item.category,
      totalItemBorrow: item.items
        .map((list) => list)
        .filter((book) => book.bookBorrowed.status === 'returned').length,
    }));

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: finalResults,
    });
  } catch (error) {
    logger.error(`ERROR Controller getBookListBorrowing for user  -  ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const getBookBorrowingDetail = async (req, res, next) => {
  try {
    const paramsId = req.params.id;

    logger.info(
      `Controller USER getBookBorrowingDetail - Get detail books selling ID : ${paramsId}`
    );

    const bookBorrowingQuery = await prisma.bookBorrowing.findUnique({
      where: { id: paramsId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        publisher: {
          select: {
            name: true,
          },
        },
        writer: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            categories: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!bookBorrowingQuery) {
      const error = new Error('Book borrowing not found');
      error.success = false;
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: bookBorrowingQuery,
    });
  } catch (error) {
    logger.error(`ERROR Controller USER getBookBorrowingDetail - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};
module.exports = {
  getBookListSelling,
  getBookSellingDetail,
  getBookListBorrowing,
  getBookBorrowingDetail,
};
