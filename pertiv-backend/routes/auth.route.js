const express = require('express');
const { loginAuth } = require('../controllers/auth/auth.controller');
const { body } = require('express-validator');
const router = express.Router();

router.post(
  '/login',
  body('email').trim().isEmail().withMessage('Invalid email input'),
  body('password')
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be at least 6 characters'),
  loginAuth
);

module.exports = router;
