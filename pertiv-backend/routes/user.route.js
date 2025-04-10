const express = require('express');
const {
  registerAccount,
  userInfo,
} = require('../controllers/auth/auth.controller');
const { body } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const {
  getBookListSelling,
  getBookSellingDetail,
  getBookListBorrowing,
  getBookBorrowingDetail,
} = require('../controllers/user/books.controller');
const {
  AddToCart,
  getCartList,
  removeItemFromCart,
  decreaseItemFromCart,
  AddToLoanCart,
  getLoanCartList,
  removeItemFromLoanCart,
} = require('../controllers/user/cart.controller');
const userMiddleware = require('../middleware/userAuth');
const {
  createOrderBook,
  paymentBookDetail,
  purchaseBook,
  cancelPurchaseBook,
  transactions,
  createBorrowBook,
  borrowTransactions,
  bookReturnRequested,
} = require('../controllers/user/order.controller');
const {
  getMemberships,
  subscribeMembership,
} = require('../controllers/user/membership.controller');

const router = express.Router();

router.post(
  '/register',
  [
    body('name')
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage('Name must be at least 3 characters & max 255 characters'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Invalid email input')
      .custom(async (value, { req }) => {
        const prisma = new PrismaClient();
        const data = await prisma.user.findMany();

        const findEmailQuery = data.find(
          (item) =>
            item.email.toLowerCase() === value.toLowerCase() &&
            item.id !== req.params.id
        );

        if (findEmailQuery) {
          const error = new Error('Email already exist');
          error.success = false;
          error.statusCode = 400;
          throw error;
        }

        return true;
      }),
    body('password').custom((value) => {
      if (!value) return true;
      if (value.length < 6 || value.length > 20) {
        throw new Error('Password must be between 6 and 20 characters');
      }
      return true;
    }),
  ],
  registerAccount
);

router.get('/books-selling', getBookListSelling);
router.get('/book-selling/:id', getBookSellingDetail);

router.post('/add-to-cart', userMiddleware, AddToCart);
router.get('/cart', userMiddleware, getCartList);
router.post('/remove-item-cart', userMiddleware, removeItemFromCart);
router.post('/decrease-item-cart', userMiddleware, decreaseItemFromCart);

router.post('/order-book', userMiddleware, createOrderBook);
router.get('/payment-detail/:id', userMiddleware, paymentBookDetail);
router.post('/purchase/:id', userMiddleware, purchaseBook);
router.post('/cancel-purchase/:id', userMiddleware, cancelPurchaseBook);
router.get('/transactions', userMiddleware, transactions);

router.get('/books-borrowing', getBookListBorrowing);
router.get('/book-borrowing/:id', getBookBorrowingDetail);

router.post('/add-to-loan-cart', userMiddleware, AddToLoanCart);
router.get('/loan-cart', userMiddleware, getLoanCartList);
router.post('/remove-item-loan-cart', userMiddleware, removeItemFromLoanCart);

router.post('/borrow-book', userMiddleware, createBorrowBook);
router.get('/borrow-transactions', userMiddleware, borrowTransactions);
router.post('/returned-book/:id', userMiddleware, bookReturnRequested);
router.get('/user-info', userMiddleware, userInfo);
router.get('/membership-type', getMemberships);
router.post('/subscribe-membership/:id', userMiddleware, subscribeMembership);

module.exports = router;
