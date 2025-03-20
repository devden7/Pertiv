const express = require('express');
const { registerAccount } = require('../controllers/auth/auth.controller');
const { body } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const {
  getBookListSelling,
  getBookSellingDetail,
} = require('../controllers/user/books.controller');
const {
  AddToCart,
  getCartList,
  removeItemFromCart,
  decreaseItemFromCart,
} = require('../controllers/user/cart.controller');

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

router.post('/add-to-cart', AddToCart);
router.get('/cart', getCartList);
router.post('/remove-item-cart', removeItemFromCart);
router.post('/decrease-item-cart', decreaseItemFromCart);

module.exports = router;
