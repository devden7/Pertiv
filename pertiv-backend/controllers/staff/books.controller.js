const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const logger = require('../../lib/winston/winstonLogger');

const addBookSelling = async (req, res, next) => {
  try {
    const {
      title,
      description,
      language,
      stock,
      publisherName,
      writerName,
      categories,
    } = req.body;

    logger.info(
      `Controller addBookSelling - Create book selling title : ${title}`
    );

    const prisma = new PrismaClient();

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error();
      error.success = false;
      error.statusCode = 400;
      error.message = errors.array();
      throw error;
    }

    const [publisher, writer] = await Promise.all([
      prisma.publisher.upsert({
        where: { name: publisherName },
        update: {},
        create: { name: publisherName },
      }),
      prisma.writer.upsert({
        where: { name: writerName },
        update: {},
        create: { name: writerName },
      }),
    ]);

    await prisma.bookSelling.create({
      data: {
        title: title.toLowerCase(),
        description,
        language,
        stock,
        user_id: 'fa8c4b3e-6fc7-476a-afb7-98c30374625f', // STILL HARDCODE FOR ID STAFF
        publisher_id: publisher.id,
        writer_id: writer.id,
        category: categories?.length
          ? {
              create: categories.map((category_id) => ({
                categories: { connect: { id: category_id } },
              })),
            }
          : undefined,
      },
      include: {
        category: true,
      },
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'The book has been added successfully.',
    });
  } catch (error) {
    logger.error(`ERROR Controller addBookSelling - ${JSON.stringify(error)}`);

    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const getBooksSelling = async (req, res, next) => {
  try {
    logger.info('Controller getBooksSelling - Get all staff accounts');

    const prisma = new PrismaClient();
    const findDataQuery = await prisma.bookSelling.findMany();

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: findDataQuery,
    });
  } catch (error) {
    logger.error(`ERROR Controller getBooksSelling  -  ${error}`);

    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

module.exports = {
  addBookSelling,
  getBooksSelling,
};
