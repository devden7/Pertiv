const { saveImgToFileSystem } = require('../../lib/multer/multer');
const bookRepository = require('../../repositories/staff/book.repository');

const insertBook = async (
  title,
  description,
  language,
  stock,
  imageUrl,
  price,
  id,
  publisherName,
  writerName,
  categories,
  file,
  fileName,
  fileBuffer
) => {
  const findBookQuery = await bookRepository.findExitingBook(title);
  const [publisher, writer] = await bookRepository.insertPublisherAndWriterBook(
    publisherName,
    writerName
  );
  const insertCategoryQuery = await bookRepository.insertCategory(categories);

  await bookRepository.addANewBook(
    findBookQuery ? 'exist' : 'new',
    title,
    description,
    language,
    stock,
    imageUrl,
    price,
    id,
    publisher.id,
    writer.id,
    insertCategoryQuery
  );

  if (file) {
    saveImgToFileSystem(fileName, fileBuffer);
  }
};

const bookSelling = async (skip, limit, keyword) => {
  const data = await bookRepository.listBooksSelling(skip, limit, keyword);
  const count = await bookRepository.count(keyword);

  return { data, count };
};

const bookSellingById = async (bookId) => {
  const data = await bookRepository.bookSellingItem(bookId);
  return { data };
};

const bookSellingUpdate = async (
  bookId,
  title,
  description,
  language,
  stock,
  imageUrl,
  price,
  publisherName,
  writerName,
  categories,
  file,
  fileName,
  fileBuffer
) => {
  const exitingBook = await bookRepository.findExitingBook(bookId);
  const [publisher, writer] = await bookRepository.insertPublisherAndWriterBook(
    publisherName,
    writerName
  );
  const insertCategoryQuery = await bookRepository.insertCategory(categories);

  await bookRepository.updateBookSelling(
    exitingBook,
    title,
    description,
    language,
    stock,
    imageUrl,
    price,
    publisher.id,
    writer.id,
    insertCategoryQuery
  );

  if (file) {
    saveImgToFileSystem(fileName, fileBuffer);
  }
};

const bookSellingDelete = async (bookId) => {
  const findExitingBook = await bookRepository.bookSellingItem(bookId);
  await bookRepository.deleteBookSelling(findExitingBook.id);
};

const insertBookBorrowing = async (
  title,
  description,
  bookPosition,
  language,
  stock,
  isMember,
  imageUrl,
  id,
  publisherName,
  writerName,
  categories,
  file,
  fileName,
  fileBuffer
) => {
  const findBookQuery = await bookRepository.findExitingBookBorrowing(title);
  const [publisher, writer] = await bookRepository.insertPublisherAndWriterBook(
    publisherName,
    writerName
  );
  const insertCategoryQuery = await bookRepository.insertCategory(categories);

  await bookRepository.addNewBookBorrowing(
    findBookQuery ? 'exist' : 'new',
    title,
    description,
    bookPosition,
    language,
    stock,
    isMember,
    imageUrl,
    id,
    publisher.id,
    writer.id,
    insertCategoryQuery
  );

  if (file) {
    saveImgToFileSystem(fileName, fileBuffer);
  }
};

const bookBorrowing = async (skip, limit, keyword) => {
  const data = await bookRepository.listBooksBorrowing(skip, limit, keyword);
  const count = await bookRepository.count(keyword);

  return { data, count };
};

const bookBorrowingById = async (bookId) => {
  const data = await bookRepository.bookBorrowingItem(bookId);
  return { data };
};

const bookBorrowingUpdate = async (
  bookId,
  title,
  description,
  bookPosition,
  language,
  stock,
  isMember,
  imageUrl,
  publisherName,
  writerName,
  categories,
  file,
  fileName,
  fileBuffer
) => {
  const exitingBook = await bookRepository.findExitingBookBorrowing(bookId);
  const [publisher, writer] = await bookRepository.insertPublisherAndWriterBook(
    publisherName,
    writerName
  );
  const insertCategoryQuery = await bookRepository.insertCategory(categories);

  await bookRepository.updateBookBorrowing(
    exitingBook,
    title,
    description,
    bookPosition,
    language,
    stock,
    isMember,
    imageUrl,
    publisher.id,
    writer.id,
    insertCategoryQuery
  );

  if (file) {
    saveImgToFileSystem(fileName, fileBuffer);
  }
};

const bookBorrowingDelete = async (bookId) => {
  const findExitingBook = await bookRepository.bookBorrowingItem(bookId);
  await bookRepository.deleteBookBorrowing(findExitingBook.id);
};

module.exports = {
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
};
