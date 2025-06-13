const prisma = require('../../utils/prismaConnection');
const baseRepository = require('../base.repository');
const bookSellingBaseRepository = baseRepository(prisma.bookSelling);
const bookBorrowingBaseRepository = baseRepository(prisma.bookBorrowing);

const findExitingBook = async (title) => {
  return await prisma.bookSelling.findUnique({
    where: {
      title: title,
      is_deleted: true,
    },
  });
};

const bookSellingItem = async (bookId) => {
  const bookSellingQuery = await prisma.bookSelling.findUnique({
    where: { id: bookId },
  });

  if (!bookSellingQuery) {
    const error = new Error('Book Selling not found');
    error.success = false;
    error.statusCode = 404;
    throw error;
  }

  return bookSellingQuery;
};

const findExitingBookBorrowing = async (title) => {
  await prisma.bookBorrowing.findUnique({
    where: {
      title: title,
      is_deleted: true,
    },
  });
};

const bookBorrowingItem = async (bookId) => {
  const bookBorrowingQuery = await prisma.bookBorrowing.findUnique({
    where: { id: bookId },
  });

  if (!bookBorrowingQuery) {
    const error = new Error('Book borrowing not found');
    error.success = false;
    error.statusCode = 404;
    throw error;
  }

  return bookBorrowingQuery;
};

const insertPublisherAndWriterBook = async (publisherName, writerName) => {
  return ([publisher, writer] = await Promise.all([
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
  ]));
};

const insertCategory = async (categoriesArr) => {
  return await Promise.all(
    categoriesArr.map(async (name) =>
      prisma.category.upsert({
        where: { name: name.toLowerCase() },
        update: {},
        create: { name: name.toLowerCase() },
      })
    )
  );
};

const addANewBook = async (
  type,
  title,
  description,
  language,
  stock,
  imageUrl,
  price,
  id,
  publisher,
  writer,
  categories
) => {
  if (type === 'exist') {
    await prisma.bookSelling.update({
      where: {
        title: title,
      },
      data: {
        title: title,
        description,
        language: language,
        stock: stock,
        imageUrl,
        price: price,
        user_id: id,
        publisher_id: publisher,
        writer_id: writer,
        category: {
          create: categories.map((name) => ({
            categories: { connect: { name: name.name } },
          })),
        },
        is_deleted: false,
      },
      include: {
        category: true,
      },
    });
  } else {
    await prisma.bookSelling.create({
      data: {
        title: title,
        description,
        language: language,
        stock: stock,
        imageUrl,
        price: price,
        user_id: id,
        publisher_id: publisher,
        writer_id: writer,
        category: {
          create: categories.map((name) => ({
            categories: { connect: { name: name.name } },
          })),
        },
      },
      include: {
        category: true,
      },
    });
  }
};

const listBooksSelling = async (skip, limit, keyword) => {
  const findDataQuery = await prisma.bookSelling.findMany({
    skip,
    take: limit,
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

  return formatQuery;
};

const updateBookSelling = async (
  exitingBook,
  title,
  description,
  language,
  stock,
  imageUrl,
  price,
  publisher,
  writer,
  categories
) => {
  await prisma.bookSelling.update({
    where: { id: exitingBook.id },
    data: {
      title: title || exitingBook.title,
      description: description || exitingBook.description,
      language: language || exitingBook.language,
      stock: stock || exitingBook.stock,
      imageUrl,
      price: price || exitingBook.price,
      publisher_id: publisher,
      writer_id: writer,
      category: {
        deleteMany: {},
        create: categories.map((category) => ({
          categories: { connect: { name: category.name } },
        })),
      },
    },
    include: {
      category: true,
    },
  });
};

const deleteBookSelling = async (bookId) => {
  await prisma.bookSelling.update({
    where: { id: bookId },
    data: { is_deleted: true },
  });
};

const addNewBookBorrowing = async (
  type,
  title,
  description,
  bookPosition,
  language,
  stock,
  isMember,
  imageUrl,
  id,
  publisher,
  writer,
  categories
) => {
  if (type === 'exist') {
    await prisma.bookBorrowing.update({
      where: {
        title,
      },
      data: {
        title,
        description,
        book_position: bookPosition,
        language: language,
        stock: stock,
        is_member: isMember,
        imageUrl,
        user_id: id,
        publisher_id: publisher,
        writer_id: writer,
        category: {
          create: categories.map((name) => ({
            categories: { connect: { name: name.name } },
          })),
        },
        is_deleted: false,
      },
      include: {
        category: true,
      },
    });
  } else {
    await prisma.bookBorrowing.create({
      data: {
        title,
        description,
        book_position: bookPosition,
        language: language,
        stock: stock,
        is_member: isMember,
        imageUrl,
        user_id: id,
        publisher_id: publisher,
        writer_id: writer,
        category: {
          create: categories.map((name) => ({
            categories: { connect: { name: name.name } },
          })),
        },
      },
      include: {
        category: true,
      },
    });
  }
};

const listBooksBorrowing = async (skip, limit, keyword) => {
  const findDataQuery = await prisma.bookBorrowing.findMany({
    skip,
    take: limit,
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

  return formatQuery;
};

const updateBookBorrowing = async (
  exitingBook,
  title,
  description,
  bookPosition,
  language,
  stock,
  isMember,
  imageUrl,
  publisher,
  writer,
  categories
) => {
  await prisma.bookBorrowing.update({
    where: { id: exitingBook.id },
    data: {
      title: title || findBookBorrowingQuery.title,
      description: description || findBookBorrowingQuery.description,
      language: language || findBookBorrowingQuery.language,
      stock: stock ?? findBookBorrowingQuery.stock,
      imageUrl,
      book_position: bookPosition || findBookBorrowingQuery.book_position,
      is_member: isMember || findBookBorrowingQuery.is_member,
      publisher_id: publisher,
      writer_id: writer,
      category: {
        deleteMany: {},
        create: categories.map((category) => ({
          categories: { connect: { name: category.name } },
        })),
      },
    },
    include: {
      category: true,
    },
  });
};

const deleteBookBorrowing = async (bookId) => {
  await prisma.bookBorrowing.update({
    where: { id: bookId },
    data: { is_deleted: true },
  });
};

module.exports = {
  findExitingBook,
  insertPublisherAndWriterBook,
  insertCategory,
  addANewBook,
  listBooksSelling,
  bookSellingItem,
  updateBookSelling,
  deleteBookSelling,
  addNewBookBorrowing,
  findExitingBookBorrowing,
  listBooksBorrowing,
  bookBorrowingItem,
  updateBookBorrowing,
  deleteBookBorrowing,
  ...bookSellingBaseRepository,
  ...bookBorrowingBaseRepository,
};
