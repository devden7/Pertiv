const express = require('express');
const { body } = require('express-validator');
const {
  addBookSelling,
  getBooksSelling,
  getDetailBookSelling,
  updateBookSelling,
  deleteBookSelling,
} = require('../controllers/staff/books.controller');
const { PrismaClient } = require('@prisma/client');
const staffMiddleware = require('../middleware/staffAuth');
const { transactions } = require('../controllers/staff/order.controller');

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
          const error = new Error('Book already exist');
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
          const error = new Error('Book already exist');
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

module.exports = router;
