const jwt = require('jsonwebtoken');
const logger = require('../../lib/winston/winstonLogger');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../../config/env');
const { validationResult } = require('express-validator');
const prisma = require('../../utils/prismaConnection');
const { formatISO } = require('date-fns');

const loginAuth = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const errors = validationResult(req);

    logger.info(`Controller loginAuth - Login informaton email : ${email}`);

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
    logger.error(`ERROR Controller loginAuth - ${error}`);

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
      throw error;
    }

    logger.info(
      `Controller registerAccount - Registration information email : ${email}`
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
    console.log(error);
    logger.error(`ERROR Controller registerAccount - ${JSON.stringify(error)}`);

    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const userInfo = async (req, res, next) => {
  try {
    const { id } = req.user;
    logger.info(`Controller AUTH userInfo - userInfo account : ${id}`);

    let findPenaltyQuery = await prisma.penalty.findMany({
      where: {
        bookBorrowed: {
          userId: id,
        },
        type: 'active',
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

    const penaltyResult = findPenaltyQuery.map((penalty) => {
      return {
        id: penalty.id,
        type: penalty.type,
        price: penalty.price,
        start_date: penalty.start_date,
        end_date: penalty.end_date,
      };
    });

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
      data: { penalty: penaltyResult, membership: findUserMembership },
    });
  } catch (error) {
    logger.error(`ERROR AUTH controller userInfo  - ${error}`);

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
