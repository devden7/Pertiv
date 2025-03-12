const express = require('express');
const {
  createStaffAccount,
  getStaffAccounts,
  updateStaffAccount,
} = require('../controllers/admin/user.controller');
const { body } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();

router.post(
  '/create-staff',
  body('name')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Name must be at least 3 characters & max 255 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email input')
    .custom(async (value) => {
      const prisma = new PrismaClient();
      const data = await prisma.user.findMany();

      const findEmailQuery = data.find(
        (item) => item.email.toLowerCase() === value.toLowerCase()
      );

      if (findEmailQuery) {
        throw new Error('Email already exist');
      }

      return true;
    }),
  body('password')
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be at least 6 characters'),
  createStaffAccount
);

router.get('/staffs', getStaffAccounts);

router.put(
  '/update-staff/:id',
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
        throw new Error('Email already exist');
      }

      return true;
    }),
  body('password')
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be at least 6 characters'),
  updateStaffAccount
);

module.exports = router;
