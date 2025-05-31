const logger = require('../../lib/winston/winstonLogger');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const prisma = require('../../utils/prismaConnection');
const { formatISO } = require('date-fns');
const { Prisma } = require('@prisma/client');
const { login, register, accountInfo } = require('../../services/auth.service');

const loginAuth = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const errors = validationResult(req);

    logger.info(`Controller loginAuth | Login informaton email : ${email}`);

    if (!errors.isEmpty()) {
      const error = new Error();
      error.success = false;
      error.statusCode = 400;
      error.message = errors.array();
      throw error;
    }

    const { findUserQuery, token } = await login({ email, password });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Login success',
      token,
      role: findUserQuery.role,
    });
  } catch (error) {
    logger.error(`Controller loginAuth | ${error}`);

    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const registerAccount = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error();
      error.success = false;
      error.statusCode = 400;
      error.message = errors.array();
      error.field = errors
        .array()
        .map((err) => err.path)
        .join(', ');
      throw error;
    }

    logger.info(
      `Controller registerAccount | Registration information email : ${email}`
    );

    await register({
      name,
      email,
      password: bcrypt.hashSync(password, 10),
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'User registered successfully',
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
      logger.error(
        `Controller registerAccount | Failed insert data to database`
      );
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      error.message = 'Internal Server Error';
      logger.error(
        `Controller registerAccount | Failed to get data from database`
      );
    } else if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
      logger.error(`Controller registerAccount | ${error.message}`);
    } else if (error.field) {
      logger.error(
        `Controller registerAccount | Validation failed | Field ${error.field})}`
      );
    } else {
      logger.error('Controller registerAccount');
    }
    next(error);
  }
};

const userInfo = async (req, res, next) => {
  try {
    const { id } = req.user;

    logger.info(`Controller userInfo | userInfo account : ${id}`);

    const { penaltyAccount, membershipAccount } = await accountInfo(id);

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        penalty: penaltyAccount.length > 0 ? penaltyAccount[0] : [],
        membership: membershipAccount,
      },
    });
  } catch (error) {
    logger.error(`Controller userInfo | ${error}`);

    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};
module.exports = {
  loginAuth,
  registerAccount,
  userInfo,
};
