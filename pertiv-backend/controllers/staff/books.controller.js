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
    const categoriesArr = Array.isArray(categories) ? categories : [categories];
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
      categoriesArr.map(async (name) =>
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
        language: language.toLowerCase(),
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
        item_orders: {
          select: {
            order: {
              select: {
                id: true,
                status: true,
                user: {
                  select: {
                    name: true,
                  },
                },
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
      const error = new Error('Books selling not found');
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
        where: { name: writerName.toLowerCase() },
        update: {},
        create: { name: writerName.toLowerCase() },
      }),
    ]);

    const categoriesQuery = await Promise.all(
      categoriesArr.map(async (name) =>
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
        language: language.toLowerCase() || findBookSellingQuery.language,
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

    await prisma.bookSelling.update({
      where: { id: paramsId },
      data: { is_deleted: true },
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
    const categoriesArr = Array.isArray(categories) ? categories : [categories];
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
        where: { name: writerName.toLowerCase() },
        update: {},
        create: { name: writerName.toLowerCase() },
      }),
    ]);

    const categoriesQuery = await Promise.all(
      categoriesArr.map(async (name) =>
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

const getBooksBorrowing = async (req, res, next) => {
  try {
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
        }
      : {};

    logger.info('Controller getBooksBorrowing - Get all book selling');

    const findDataQuery = await prisma.bookBorrowing.findMany({
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
        book_position: true,
        language: true,
        stock: true,
        imageUrl: true,
        is_member: true,
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

        items: {
          select: {
            bookBorrowed: {
              select: {
                id: true,
                status: true,
                user: {
                  select: {
                    name: true,
                  },
                },
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

    const countOrder = await prisma.bookBorrowing.count({
      where: keyword,
    });
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: formatQuery,
      totalCount: countOrder,
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
    const paramsId = req.params.id;

    logger.info(
      `Controller getDetailBookBorrowing - Get detail books selling ID : ${paramsId}`
    );

    const bookBorrowingQuery = await prisma.bookBorrowing.findUnique({
      where: { id: paramsId },
      select: {
        id: true,
        title: true,
        description: true,
        book_position: true,
        language: true,
        stock: true,
        imageUrl: true,
        is_member: true,
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

        items: {
          select: {
            bookBorrowed: {
              select: {
                id: true,
                status: true,
                user: {
                  select: {
                    name: true,
                  },
                },
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
    const formatQuery = {
      ...bookBorrowingQuery,
      category: bookBorrowingQuery.category.map((c) => c.categories.name),
    };

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: formatQuery,
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
      `Controller STAFF updateBookBorrowing - Updating Book Selling with ID : ${paramsId} - Title : ${title}`
    );

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error();
      error.success = false;
      error.statusCode = 400;
      error.message = errors.array();
      throw error;
    }

    const findBookBorrowingQuery = await prisma.bookBorrowing.findUnique({
      where: { id: paramsId },
    });

    if (!findBookBorrowingQuery) {
      const error = new Error('Books borrowing not found');
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
        where: { name: writerName.toLowerCase() },
        update: {},
        create: { name: writerName.toLowerCase() },
      }),
    ]);

    const categoriesQuery = await Promise.all(
      categoriesArr.map(async (name) =>
        prisma.category.upsert({
          where: { name: name.toLowerCase() },
          update: {},
          create: { name: name.toLowerCase() },
        })
      )
    );

    await prisma.bookBorrowing.update({
      where: { id: paramsId },
      data: {
        title: title.toLowerCase() || findBookBorrowingQuery.title,
        description: description || findBookBorrowingQuery.description,
        language: language.toLowerCase() || findBookBorrowingQuery.language,
        stock: parseInt(stock) ?? findBookBorrowingQuery.stock,
        imageUrl,
        book_position:
          bookPosition.toLowerCase() || findBookBorrowingQuery.book_position,
        is_member:
          isMember === 'true'
            ? true
            : false || findBookBorrowingQuery.is_member,
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
      `ERROR STAFF Controller updateBookBorrowing - ${JSON.stringify(error)}`
    );

    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const deleteBookBorrowing = async (req, res, next) => {
  try {
    const paramsId = req.params.id;

    logger.info(
      `Controller STAFF deleteBookBorrowing - Delete book selling with ID: ${paramsId}`
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

    await prisma.bookBorrowing.update({
      where: { id: paramsId },
      data: { is_deleted: true },
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'The book has been deleted successfully.',
    });
  } catch (error) {
    logger.error(`ERROR STAFF Controller deleteBookBorrowing - ${error}`);

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
