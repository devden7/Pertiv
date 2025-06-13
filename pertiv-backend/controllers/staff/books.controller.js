const { validationResult } = require('express-validator');
const logger = require('../../lib/winston/winstonLogger');
const prisma = require('../../utils/prismaConnection');
const { Prisma } = require('@prisma/client');
const {
  insertBook,
  bookSelling,
  bookSellingById,
  bookSellingUpdate,
  bookSellingDelete,
  insertBookBorrowing,
  bookBorrowing,
  bookBorrowingById,
  bookBorrowingUpdate,
  bookBorrowingDelete,
} = require('../../services/staff/book.service');

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
    const categoriesArr = Array.isArray(categories) ? categories : [categories];
    const { id } = req.user;
    const fileNameImage = req.file
      ? Date.now() + '-' + req.file.originalname
      : null;
    const imageUrl = req.file ? `/uploads/${fileNameImage}` : null;

    logger.info(
      `Controller addBookSelling | Staff with ID : ${id} | Create book selling title : ${title}`
    );

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error();
      error.success = false;
      error.statusCode = 400;
      error.message = errors.array();
      error.field = errors
        .array()
        .map((err) => err.path)
        .join(', ');
      throw error;
    }

    await insertBook(
      title.toLowerCase(),
      description,
      language.toLowerCase(),
      parseInt(stock),
      imageUrl,
      parseInt(price),
      id,
      publisherName.toLowerCase(),
      writerName.toLowerCase(),
      categoriesArr,
      req.file,
      fileNameImage,
      req.file.buffer
    );

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'The book has been added successfully.',
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
      logger.error(
        `Controller addBookSelling | Failed insert data to database`
      );
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      error.message = 'Internal Server Error';
      logger.error(
        `Controller addBookSelling | Failed to get data from database`
      );
    } else if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
      logger.error(`Controller addBookSelling | ${error.message}`);
    } else if (error.field) {
      logger.error(
        `Controller addBookSelling | Validation failed | Field ${error.field}`
      );
    } else {
      logger.error('Controller addBookSelling');
    }
    next(error);
  }
};

const getBooksSelling = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const LIMIT = 10;
    const skip = (page - 1) * LIMIT;
    const keyword = search
      ? {
          is_deleted: false,
          OR: [
            {
              title: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              item_orders: {
                some: {
                  order: {
                    user: {
                      name: {
                        contains: search,
                        mode: 'insensitive',
                      },
                    },
                  },
                },
              },
            },
          ],
        }
      : { is_deleted: false };

    logger.info(
      `Controller getBooksSelling | Staff with ID : ${id} | Get all book selling`
    );

    const { data, count } = await bookSelling(skip, LIMIT, keyword);

    res.status(200).json({
      success: true,
      statusCode: 200,
      data,
      totalCount: count,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      error.message = 'Internal Server Error';
      logger.error(
        `Controller getBooksSelling | Failed to get data from database`
      );
    } else if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
      logger.error(`Controller getBooksSelling | ${error.message}`);
    } else {
      logger.error(`Controller addBookSelling | ${error.message}`);
    }
    next(error);
  }
};

const getDetailBookSelling = async (req, res, next) => {
  try {
    const { id } = req.user;
    const paramsId = req.params.id;

    logger.info(
      `Controller getDetailBookSelling | Staff with ID : ${id} | Get detail books selling ID : ${paramsId}`
    );

    const { data } = await bookSellingById(paramsId);

    res.status(200).json({
      success: true,
      statusCode: 200,
      data,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      error.message = 'Internal Server Error';
      logger.error(
        `Controller getDetailBookSelling | Failed to get data from database`
      );
    } else if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
      logger.error(`Controller getDetailBookSelling | ${error.message}`);
    } else {
      logger.error(`Controller getDetailBookSelling | ${error.message}`);
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
    const { id } = req.user;
    const categoriesArr = Array.isArray(categories) ? categories : [categories];
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
      `Controller updateBookSelling | Staff with ID : ${id} | Updating Book Selling with ID : ${paramsId} - Title : ${title}`
    );

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error();
      error.success = false;
      error.statusCode = 400;
      error.message = errors.array();
      error.field = errors
        .array()
        .map((err) => err.path)
        .join(', ');
      throw error;
    }

    await bookSellingUpdate(
      paramsId,
      title.toLowerCase(),
      description,
      language.toLowerCase(),
      parseInt(stock),
      imageUrl,
      parseInt(price),
      publisherName.toLowerCase(),
      writerName.toLowerCase(),
      categoriesArr,
      req.file,
      fileNameImage,
      req.file.buffer
    );

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Book updated successfully',
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
      logger.error(
        `Controller updateBookSelling | Failed insert data to database`
      );
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      error.message = 'Internal Server Error';
      logger.error(
        `Controller updateBookSelling | Failed to get data from database`
      );
    } else if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
      logger.error(`Controller updateBookSelling | ${error.message}`);
    } else if (error.field) {
      logger.error(
        `Controller updateBookSelling | Validation failed | Field ${error.field}`
      );
    } else {
      logger.error('Controller updateBookSelling');
    }
    next(error);
  }
};

const deleteBookSelling = async (req, res, next) => {
  try {
    const { id } = req.user;
    const paramsId = req.params.id;

    logger.info(
      `Controller deleteBookSelling | Staff with ID : ${id} | Delete book selling with ID: ${paramsId}`
    );

    await bookSellingDelete(paramsId);
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
    const categoriesArr = Array.isArray(categories) ? categories : [categories];
    const { id } = req.user;
    const fileNameImage = req.file
      ? Date.now() + '-' + req.file.originalname
      : null;
    const imageUrl = req.file ? `/uploads/${fileNameImage}` : null;

    logger.info(
      `Controller STAFF addBookBorrowing | Staff with ID : ${id} | Create book borrowing title : ${title}`
    );

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error();
      error.success = false;
      error.statusCode = 400;
      error.message = errors.array();
      error.field = errors
        .array()
        .map((err) => err.path)
        .join(', ');
      throw error;
    }

    await insertBookBorrowing(
      title.toLowerCase(),
      description,
      bookPosition.toLowerCase(),
      language.toLowerCase(),
      parseInt(stock),
      isMember === 'true' ? true : false,
      imageUrl,
      id,
      publisherName.toLowerCase(),
      writerName.toLowerCase(),
      categoriesArr,
      req.file,
      fileNameImage,
      req.file.buffer
    );

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'The book has been added successfully.',
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
      logger.error(
        `Controller addBookBorrowing | Failed insert data to database`
      );
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      error.message = 'Internal Server Error';
      logger.error(
        `Controller addBookBorrowing | Failed to get data from database`
      );
    } else if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
      logger.error(`Controller addBookBorrowing | ${error.message}`);
    } else if (error.field) {
      logger.error(
        `Controller addBookBorrowing | Validation failed | Field ${error.field}`
      );
    } else {
      logger.error('Controller addBookBorrowing');
    }
    next(error);
  }
};

const getBooksBorrowing = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const LIMIT = 10;
    const skip = (page - 1) * LIMIT;
    const keyword = search
      ? {
          OR: [
            {
              title: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              items: {
                some: {
                  bookBorrowed: {
                    user: {
                      name: {
                        contains: search,
                        mode: 'insensitive',
                      },
                    },
                  },
                },
              },
            },
          ],
          is_deleted: false,
        }
      : {
          is_deleted: false,
        };

    logger.info(
      `Controller getBooksBorrowing | Staff with ID : ${id} | Get all book selling`
    );
    const { data, count } = await bookBorrowing(skip, LIMIT, keyword);

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: data,
      totalCount: count,
    });
  } catch (error) {
    logger.error(`ERROR Controller getBooksBorrowing  -  ${error}`);

    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const getDetailBookBorrowing = async (req, res, next) => {
  try {
    const { id } = req.user;
    const paramsId = req.params.id;

    logger.info(
      `Controller getDetailBookBorrowing | Staff with ID : ${id} | Get detail books selling ID : ${paramsId}`
    );

    const data = await bookBorrowingById(paramsId);

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: data,
    });
  } catch (error) {
    logger.error(`ERROR Controller getDetailBookBorrowing - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const updateBookBorrowing = async (req, res, next) => {
  try {
    const { id } = req.user;
    const paramsId = req.params.id;
    const {
      title,
      description,
      language,
      stock,
      publisherName,
      image,
      bookPosition,
      isMember,
      writerName,
      categories,
    } = req.body;
    const categoriesArr = Array.isArray(categories) ? categories : [categories];
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
      `Controller STAFF updateBookBorrowing  | Staff with ID : ${id} | Updating Book Selling with ID : ${paramsId} - Title : ${title}`
    );

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error();
      error.success = false;
      error.statusCode = 400;
      error.message = errors.array();
      error.field = errors
        .array()
        .map((err) => err.path)
        .join(', ');
      throw error;
    }

    await bookBorrowingUpdate(
      paramsId,
      title.toLowerCase(),
      description,
      bookPosition.toLowerCase(),
      language.toLowerCase(),
      parseInt(stock),
      isMember === 'true' ? true : false,
      imageUrl,
      publisherName.toLowerCase(),
      writerName.toLowerCase(),
      categoriesArr,
      req.file,
      fileNameImage,
      req.file.buffer
    );

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Book updated successfully',
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
      logger.error(
        `Controller updateBookBorrowing | Failed insert data to database`
      );
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      error.message = 'Internal Server Error';
      logger.error(
        `Controller updateBookBorrowing | Failed to get data from database`
      );
    } else if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
      logger.error(`Controller updateBookBorrowing | ${error.message}`);
    } else if (error.field) {
      logger.error(
        `Controller updateBookBorrowing | Validation failed | Field ${error.field}`
      );
    } else {
      logger.error('Controller updateBookBorrowing');
    }
    next(error);
  }
};

const deleteBookBorrowing = async (req, res, next) => {
  try {
    const { id } = req.user;
    const paramsId = req.params.id;

    logger.info(
      `Controller STAFF deleteBookBorrowing  | Staff with ID : ${id} | Delete book selling with ID: ${paramsId}`
    );

    const findBookQuery = await prisma.bookBorrowing.findUnique({
      where: { id: paramsId },
    });

    if (!findBookQuery) {
      const error = new Error('Book Borrowing not found');
      error.success = false;
      error.statusCode = 404;
      throw error;
    }

    await bookBorrowingDelete(paramsId);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'The book has been deleted successfully.',
    });
  } catch (error) {
    logger.error(`Controller deleteBookBorrowing | ${error}`);

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
  getBooksBorrowing,
  getDetailBookBorrowing,
  updateBookBorrowing,
  deleteBookBorrowing,
};
