const jwt = require('jsonwebtoken');
const logger = require('../../lib/winston/winstonLogger');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../../config/env');
const { validationResult } = require('express-validator');
const prisma = require('../../utils/prismaConnection');
const { formatISO } = require('date-fns');
const { Prisma } = require('@prisma/client');

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

    const findUserQuery = await prisma.user.findUnique({
      where: { email },
    });

    if (!findUserQuery) {
      const error = new Error('Email not registered');
      error.success = false;
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, findUserQuery.password);

    if (!isMatch) {
      const error = new Error('Your password is wrong');
      error.success = false;
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        id: findUserQuery.id,
        email: findUserQuery.email,
        name: findUserQuery.name,
        role: findUserQuery.role,
        image: findUserQuery.image,
      },
      JWT_SECRET,
      {
        expiresIn: '1d',
      }
    );

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

    await prisma.user.create({
      data: {
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        role: 'user',
        image: null,
      },
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

    let findPenaltyQuery = await prisma.penalty.findMany({
      where: {
        bookBorrowed: {
          userId: id,
        },
        type: 'active',
      },
      select: {
        id: true,
        type: true,
        price: true,
        start_date: true,
        end_date: true,
      },
    });

    if (findPenaltyQuery.length > 0) {
      const dateNow = formatISO(new Date());
      const dateDuePenalty = formatISO(findPenaltyQuery[0].end_date);

      if (dateNow > dateDuePenalty) {
        findPenaltyQuery = await prisma.penalty.update({
          where: {
            id: findPenaltyQuery[0].id,
            bookBorrowed: {
              userId: id,
            },
            type: 'active',
          },
          data: {
            type: 'inactive',
          },
        });
      }
    }

    let findUserMembership = await prisma.membershipTransaction.findMany({
      where: {
        user_id: id,
        status: 'active',
      },
      orderBy: {
        start_date: 'desc',
      },
    });

    if (findUserMembership.length > 0) {
      const dateNow = formatISO(new Date());
      const dateEndMembership = formatISO(findUserMembership[0].end_date);

      if (dateNow > dateEndMembership) {
        findUserMembership = await prisma.membershipTransaction.update({
          where: {
            id: findUserMembership[0].id,
            status: 'active',
          },
          data: {
            status: 'inactive',
          },
        });
      }
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        penalty: findPenaltyQuery.length > 0 ? findPenaltyQuery[0] : [],
        membership: findUserMembership,
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
