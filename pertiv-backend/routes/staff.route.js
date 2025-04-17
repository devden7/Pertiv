const express = require('express');
const { body } = require('express-validator');
const {
  addBookSelling,
  getBooksSelling,
  getDetailBookSelling,
  updateBookSelling,
  deleteBookSelling,
  addBookBorrowing,
  getBooksBorrowing,
  updateBookBorrowing,
  deleteBookBorrowing,
  getDetailBookBorrowing,
} = require('../controllers/staff/books.controller');
const { PrismaClient } = require('@prisma/client');
const staffMiddleware = require('../middleware/staffAuth');
const {
  transactions,
  confirmOrder,
  borrowtransactions,
  acceptLoanBook,
  rejectLoanBook,
  confirmLoan,
  bookReturnRequested,
  confirmReturnBook,
  transactionDetail,
  borrowtransactionDetail,
} = require('../controllers/staff/order.controller');
const { dashboard } = require('../controllers/staff/dashboard.controller');
const {
  createMembership,
  getMemberships,
  updateMembershipType,
  deleteMembershipType,
} = require('../controllers/staff/membership.controller');

const router = express.Router();

router.post(
  '/add-book-selling',
  staffMiddleware,
  [
    body('title')
      .trim()
      .custom(async (value) => {
        const prisma = new PrismaClient();
        const data = await prisma.bookSelling.findMany();

        const findBookQuery = data.find(
          (item) => item.title === value.toLowerCase()
        );

        if (findBookQuery) {
          const error = new Error('Book Title already exist');
          error.success = false;
          error.statusCode = 400;
          throw error;
        }

        return true;
      })
      .isLength({ min: 3, max: 255 })
      .withMessage('Title must be at least 3 characters & max 255 characters'),
    body('description')
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage(
        'Description must be at least 3 characters & max 255 characters'
      ),
    body('language')
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage(
        'Language must be at least 3 characters & max 255 characters'
      ),
    body('stock')
      .isInt({ min: 0 })
      .withMessage('Stock must be a number and at least 0'),
    body('price')
      .isInt({ min: 1000, max: 1000000 })
      .withMessage(
        'price must be a number and at least RP 1000 and max RP 1.000.000'
      ),
    body('publisherName')
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage(
        'Publisher Name must be at least 3 characters & max 255 characters'
      ),
    body('writerName')
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage(
        'Writer Name must be at least 3 characters & max 255 characters'
      ),
    body('categories').trim().notEmpty().withMessage('Please input a category'),
  ],
  addBookSelling
);

router.get('/books-selling', staffMiddleware, getBooksSelling);
router.get('/book-selling/:id', staffMiddleware, getDetailBookSelling);

router.put(
  '/update-book-selling/:id',
  staffMiddleware,
  [
    body('title')
      .trim()
      .custom(async (value, { req }) => {
        const prisma = new PrismaClient();
        const data = await prisma.bookSelling.findMany();

        const findBookQuery = data.find(
          (item) =>
            item.title === value.toLowerCase() && item.id !== req.params.id
        );

        if (findBookQuery) {
          const error = new Error('Book Title already exist');
          error.success = false;
          error.statusCode = 400;
          throw error;
        }

        return true;
      })
      .isLength({ min: 3, max: 255 })
      .withMessage('Title must be at least 3 characters & max 255 characters'),
    body('description')
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage(
        'Description must be at least 3 characters & max 255 characters'
      ),
    body('language')
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage(
        'Language must be at least 3 characters & max 255 characters'
      ),
    body('stock')
      .isInt({ min: 0 })
      .withMessage('Stock must be a number and at least 0'),
    body('price')
      .isInt({ min: 1000, max: 1000000 })
      .withMessage(
        'price must be a number and at least RP 1000 and max RP 1.000.000'
      ),
    body('publisherName')
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage(
        'Publisher Name must be at least 3 characters & max 255 characters'
      ),
    body('writerName')
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage(
        'Writer Name must be at least 3 characters & max 255 characters'
      ),
    body('categories').trim().notEmpty().withMessage('Please input a category'),
  ],
  updateBookSelling
);

router.delete('/delete-book-selling/:id', staffMiddleware, deleteBookSelling);
router.get('/transactions', staffMiddleware, transactions);
router.get('/transaction-detail/:id', staffMiddleware, transactionDetail);
router.post('/confirm-order/', staffMiddleware, confirmOrder);
router.get('/dashboard', staffMiddleware, dashboard);

router.post(
  '/add-book-borrowing',
  staffMiddleware,
  [
    body('title')
      .trim()
      .custom(async (value) => {
        const prisma = new PrismaClient();
        const data = await prisma.bookBorrowing.findMany();

        const findBookQuery = data.find(
          (item) => item.title === value.toLowerCase()
        );

        if (findBookQuery) {
          const error = new Error('Book Title already exist');
          error.success = false;
          error.statusCode = 400;
          throw error;
        }

        return true;
      })
      .isLength({ min: 3, max: 255 })
      .withMessage('Title must be at least 3 characters & max 255 characters'),
    body('description')
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage(
        'Description must be at least 3 characters & max 255 characters'
      ),
    body('bookPosition')
      .trim()
      .isLength({ min: 3, max: 10 })
      .withMessage(
        'Book position must be at least 3 characters & max 10 characters'
      ),
    body('language')
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage(
        'Language must be at least 3 characters & max 255 characters'
      ),
    body('stock')
      .isInt({ min: 0 })
      .withMessage('Stock must be a number and at least 0'),
    body('isMember').isBoolean().withMessage('isMember must be boolean'),
    body('publisherName')
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage(
        'Publisher Name must be at least 3 characters & max 255 characters'
      ),
    body('writerName')
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage(
        'Writer Name must be at least 3 characters & max 255 characters'
      ),
    body('categories').trim().notEmpty().withMessage('Please input a category'),
  ],
  addBookBorrowing
);
router.put(
  '/update-book-borrowing/:id',
  staffMiddleware,
  [
    body('title')
      .trim()
      .custom(async (value, { req }) => {
        const prisma = new PrismaClient();
        const data = await prisma.bookBorrowing.findMany();

        const findBookQuery = data.find(
          (item) =>
            item.title === value.toLowerCase() && item.id !== req.params.id
        );

        if (findBookQuery) {
          const error = new Error('Book Title already exist');
          error.success = false;
          error.statusCode = 400;
          throw error;
        }

        return true;
      })
      .isLength({ min: 3, max: 255 })
      .withMessage('Title must be at least 3 characters & max 255 characters'),
    body('description')
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage(
        'Description must be at least 3 characters & max 255 characters'
      ),
    body('bookPosition')
      .trim()
      .isLength({ min: 3, max: 10 })
      .withMessage(
        'Book position must be at least 3 characters & max 10 characters'
      ),
    body('language')
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage(
        'Language must be at least 3 characters & max 255 characters'
      ),
    body('stock')
      .isInt({ min: 0 })
      .withMessage('Stock must be a number and at least 0'),
    body('isMember').isBoolean().withMessage('isMember must be boolean'),
    body('publisherName')
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage(
        'Publisher Name must be at least 3 characters & max 255 characters'
      ),
    body('writerName')
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage(
        'Writer Name must be at least 3 characters & max 255 characters'
      ),
    body('categories').trim().notEmpty().withMessage('Please input a category'),
  ],
  updateBookBorrowing
);

router.get('/books-borrowing', staffMiddleware, getBooksBorrowing);
router.get('/book-borrowing/:id', staffMiddleware, getDetailBookBorrowing);
router.delete(
  '/delete-book-borrowing/:id',
  staffMiddleware,
  deleteBookBorrowing
);

router.get('/borrow-transactions', staffMiddleware, borrowtransactions);
router.get(
  '/borrow-transaction-detail/:id',
  staffMiddleware,
  borrowtransactionDetail
);
router.post('/accept-loan-book/:id', staffMiddleware, acceptLoanBook);
router.post('/reject-loan-book/:id', staffMiddleware, rejectLoanBook);
router.post('/confirm-loan/', staffMiddleware, confirmLoan);
router.post('/confirm-return', staffMiddleware, confirmReturnBook);

router.post(
  '/add-membership',
  staffMiddleware,
  [
    body('name')
      .trim()
      .custom(async (value) => {
        const prisma = new PrismaClient();
        const data = await prisma.membership.findMany();

        const findMembershipkQuery = data.find(
          (item) => item.name === value.toLowerCase()
        );

        if (findMembershipkQuery) {
          const error = new Error('Name already exist');
          error.success = false;
          error.statusCode = 400;
          throw error;
        }

        return true;
      })
      .isLength({ min: 3, max: 50 })
      .withMessage('Title must be at least 3 characters & max 50 characters'),
    body('description')
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage(
        'Description must be at least 3 characters & max 255 characters'
      ),
    body('durationDays')
      .isInt({ min: 1 })
      .withMessage('durationDays must be a number and at least 1'),
    body('maxBorrow')
      .isInt({ min: 1 })
      .withMessage('maxBorrow must be a number and at least 1'),
    body('maxReturn')
      .isInt({ min: 1 })
      .withMessage('maxReturn must be a number and at least 1'),
    body('price')
      .isInt({ min: 1000, max: 1000000 })
      .withMessage(
        'price must be a number and at least RP 1000 and max RP 1.000.000'
      ),
  ],
  createMembership
);
router.get('/membership-type', staffMiddleware, getMemberships);

router.put(
  '/update-membership/:id',
  staffMiddleware,
  [
    body('name')
      .trim()
      .custom(async (value, { req }) => {
        const prisma = new PrismaClient();
        const data = await prisma.membership.findMany();

        const findMembershipkQuery = data.find(
          (item) =>
            item.name === value.toLowerCase() && item.id !== req.params.id
        );

        if (findMembershipkQuery) {
          const error = new Error('Name already exist');
          error.success = false;
          error.statusCode = 400;
          throw error;
        }

        return true;
      })
      .isLength({ min: 3, max: 50 })
      .withMessage('Title must be at least 3 characters & max 50 characters'),
    body('description')
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage(
        'Description must be at least 3 characters & max 255 characters'
      ),
    body('durationDays')
      .isInt({ min: 1 })
      .withMessage('durationDays must be a number and at least 1'),
    body('maxBorrow')
      .isInt({ min: 1 })
      .withMessage('maxBorrow must be a number and at least 1'),
    body('maxReturn')
      .isInt({ min: 1 })
      .withMessage('maxReturn must be a number and at least 1'),
    body('price')
      .isInt({ min: 1000, max: 1000000 })
      .withMessage(
        'price must be a number and at least RP 1000 and max RP 1.000.000'
      ),
  ],
  updateMembershipType
);

router.delete('/delete-membership/:id', staffMiddleware, deleteMembershipType);

module.exports = router;
