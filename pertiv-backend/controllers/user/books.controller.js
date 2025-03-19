const { PrismaClient } = require('@prisma/client');
const logger = require('../../lib/winston/winstonLogger');

const prisma = new PrismaClient();
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

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: booksSellingQuery,
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
module.exports = {
  getBookListSelling,
  getBookSellingDetail,
};
