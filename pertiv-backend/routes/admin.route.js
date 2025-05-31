const express = require('express');
const {
  createStaffAccount,
  getStaffAccounts,
  updateStaffAccount,
  deleteStaffAccount,
  getStaffAccountDetail,
} = require('../controllers/admin/user.controller');
const { body } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const adminMiddleware = require('../middleware/adminAuth');
const getActivityLogs = require('../controllers/admin/log.controller');
const router = express.Router();

router.post(
  '/create-staff',
  adminMiddleware,
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
        const error = new Error('Email already exist');
        error.success = false;
        error.statusCode = 400;
        throw error;
      }

      return true;
    }),
  body('password')
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be at least 6 characters'),
  createStaffAccount
);

router.get('/staffs', adminMiddleware, getStaffAccounts);

router.put(
  '/update-staff/:id',
  adminMiddleware,
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
  updateStaffAccount
);

router.delete('/delete-staff/:id', adminMiddleware, deleteStaffAccount);

router.get('/logs', adminMiddleware, getActivityLogs);
module.exports = router;
