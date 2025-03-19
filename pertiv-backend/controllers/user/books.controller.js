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

module.exports = {
  getBookListSelling,
};
