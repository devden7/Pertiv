const { validationResult } = require('express-validator');
const logger = require('../../lib/winston/winstonLogger');
const { saveImgToFileSystem } = require('../../lib/multer/multer');
const prisma = require('../../utils/prismaConnection');

const addBookSelling = async (req, res, next) => {
  try {
    const {
      title,
      description,
      language,
      stock,
      price,
      publisherName,
      writerName,
      categories,
    } = req.body;
    const { id } = req.user;
    const fileNameImage = req.file
      ? Date.now() + '-' + req.file.originalname
      : null;
    const imageUrl = req.file ? `/uploads/${fileNameImage}` : null;

    logger.info(
      `Controller addBookSelling - Create book selling title : ${title}`
    );

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
        where: { name: publisherName.toLowerCase() },
        update: {},
        create: { name: publisherName.toLowerCase() },
      }),
      prisma.writer.upsert({
        where: { name: writerName.toLowerCase() },
        update: {},
        create: { name: writerName.toLowerCase() },
      }),
    ]);

    const categoriesQuery = await Promise.all(
      categories.map(async (name) =>
        prisma.category.upsert({
          where: { name: name.toLowerCase() },
          update: {},
          create: { name: name.toLowerCase() },
        })
      )
    );

    await prisma.bookSelling.create({
      data: {
        title: title.toLowerCase(),
        description,
        language,
        stock: parseInt(stock),
        imageUrl,
        price: parseInt(price),
        user_id: id,
        publisher_id: publisher.id,
        writer_id: writer.id,
        category: {
          create: categoriesQuery.map((name) => ({
            categories: { connect: { name: name.name } },
          })),
        },
      },
      include: {
        category: true,
      },
    });

    if (req.file) {
      saveImgToFileSystem(fileNameImage, req.file.buffer);
    }

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
    const { search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const LIMIT = 10;
    const skip = (page - 1) * LIMIT;
    const keyword = search
      ? {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        }
      : {};

    logger.info('Controller getBooksSelling - Get all book selling');

    const findDataQuery = await prisma.bookSelling.findMany({
      skip,
      take: LIMIT,
      orderBy: {
        created_at: 'desc',
      },
      where: keyword,
      select: {
        id: true,
        title: true,
        description: true,
        language: true,
        stock: true,
        imageUrl: true,
        price: true,
        created_at: true,
        user_id: true,
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
                name: true,
              },
            },
          },
        },
      },
    });

    const formatQuery = findDataQuery.map((book) => ({
      ...book,
      category: book.category.map((c) => c.categories.name),
    }));

    const countOrder = await prisma.bookSelling.count({
      where: keyword,
    });
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: formatQuery,
      totalCount: countOrder,
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

const getDetailBookSelling = async (req, res, next) => {
  try {
    const paramsId = req.params.id;

    logger.info(
      `Controller getDetailBookSelling - Get detail books selling ID : ${paramsId}`
    );

    const bookSellingQuery = await prisma.bookSelling.findUnique({
      where: { id: paramsId },
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
    logger.error(`ERROR Controller getDetailBookSelling - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const updateBookSelling = async (req, res, next) => {
  try {
    const paramsId = req.params.id;
    const {
      title,
      description,
      language,
      stock,
      publisherName,
      image,
      price,
      writerName,
      categories,
    } = req.body;

    const fileNameImage =
      !req.file && !image
        ? null
        : !req.file && image
        ? image
        : Date.now() + '-' + req.file.originalname;

    const imageUrl = !fileNameImage
      ? null
      : !req.file && image
      ? image
      : `/uploads/${fileNameImage}`;

    logger.info(
      `Controller updateBookSelling - Updating Book Selling with ID : ${paramsId} - Title : ${title}`
    );

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error();
      error.success = false;
      error.statusCode = 400;
      error.message = errors.array();
      throw error;
    }

    const findBookSellingQuery = await prisma.bookSelling.findUnique({
      where: { id: paramsId },
    });

    if (!findBookSellingQuery) {
      const error = new Error('Staff account not found');
      error.success = false;
      error.statusCode = 404;
      throw error;
    }

    const [publisher, writer] = await Promise.all([
      prisma.publisher.upsert({
        where: { name: publisherName.toLowerCase() },
        update: {},
        create: { name: publisherName.toLowerCase() },
      }),
      prisma.writer.upsert({
        where: { name: writerName },
        update: {},
        create: { name: writerName },
      }),
    ]);

    const categoriesQuery = await Promise.all(
      categories.map(async (name) =>
        prisma.category.upsert({
          where: { name: name.toLowerCase() },
          update: {},
          create: { name: name.toLowerCase() },
        })
      )
    );

    await prisma.bookSelling.update({
      where: { id: paramsId },
      data: {
        title: title?.toLowerCase() || findBookSellingQuery.title,
        description: description || findBookSellingQuery.description,
        language: language || findBookSellingQuery.language,
        stock: parseInt(stock) || findBookSellingQuery.stock,
        imageUrl,
        price: parseInt(price) || findBookSellingQuery.price,
        publisher_id: publisher.id,
        writer_id: writer.id,
        category: {
          deleteMany: {},
          create: categoriesQuery.map((category) => ({
            categories: { connect: { name: category.name } },
          })),
        },
      },
      include: {
        category: true,
      },
    });

    if (req.file) {
      saveImgToFileSystem(fileNameImage, req.file.buffer);
    }

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Book updated successfully',
    });
  } catch (error) {
    logger.error(
      `ERROR Controller updateBookSelling - ${JSON.stringify(error)}`
    );

    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const deleteBookSelling = async (req, res, next) => {
  try {
    const paramsId = req.params.id;

    logger.info(
      `Controller deleteBookSelling - Delete book selling with ID: ${paramsId}`
    );

    const findBookQuery = await prisma.bookSelling.findUnique({
      where: { id: paramsId },
    });

    if (!findBookQuery) {
      const error = new Error('Book selling not found');
      error.success = false;
      error.statusCode = 404;
      throw error;
    }

    await prisma.bookCategorySell.deleteMany({
      where: { book_id: paramsId },
    });

    await prisma.bookSelling.delete({
      where: { id: paramsId },
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'The book has been deleted successfully.',
    });
  } catch (error) {
    logger.error(`ERROR Controller deleteBookSelling - ${error}`);

    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const addBookBorrowing = async (req, res, next) => {
  try {
    const {
      title,
      description,
      bookPosition,
      language,
      stock,
      isMember,
      publisherName,
      writerName,
      categories,
    } = req.body;

    const { id } = req.user;
    const fileNameImage = req.file
      ? Date.now() + '-' + req.file.originalname
      : null;
    const imageUrl = req.file ? `/uploads/${fileNameImage}` : null;

    logger.info(
      `Controller STAFF addBookBorrowing - Create book selling title : ${title}`
    );

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
        where: { name: publisherName.toLowerCase() },
        update: {},
        create: { name: publisherName.toLowerCase() },
      }),
      prisma.writer.upsert({
        where: { name: writerName },
        update: {},
        create: { name: writerName },
      }),
    ]);

    const categoriesQuery = await Promise.all(
      categories.map(async (name) =>
        prisma.category.upsert({
          where: { name: name.toLowerCase() },
          update: {},
          create: { name: name.toLowerCase() },
        })
      )
    );
    console.log(isMember);
    await prisma.bookBorrowing.create({
      data: {
        title: title.toLowerCase(),
        description,
        book_position: bookPosition.toLowerCase(),
        language: language.toLowerCase(),
        stock: parseInt(stock),
        is_member: isMember === 'true' ? true : false,
        imageUrl,
        user_id: id,
        publisher_id: publisher.id,
        writer_id: writer.id,
        category: {
          create: categoriesQuery.map((name) => ({
            categories: { connect: { name: name.name } },
          })),
        },
      },
      include: {
        category: true,
      },
    });

    if (req.file) {
      saveImgToFileSystem(fileNameImage, req.file.buffer);
    }

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'The book has been added successfully.',
    });
  } catch (error) {
    console.log(error);
    logger.error(`ERROR Controller STAFF addBookBorrowing - ${error}`);

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
  getDetailBookSelling,
  updateBookSelling,
  deleteBookSelling,
  addBookBorrowing,
};
