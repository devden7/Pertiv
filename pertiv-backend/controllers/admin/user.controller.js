const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const logger = require('../../lib/winston/winstonLogger');
const { Prisma } = require('@prisma/client');
const {
  createUser,
  getAllStaff,
  updateStaff,
  deleteStaff,
} = require('../../services/admin/user.service');

const createStaffAccount = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { name, email, password } = req.body;

    logger.info(
      `Controller createStaffAccount | Admin with ID : ${id} | Creating staff account with Name : ${name} - Email : ${email}`
    );

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

    await createUser({
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      role: 'staff',
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Staff account created successfully',
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
      logger.error(
        `Controller createStaffAccount | Failed insert data to database`
      );
    } else if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
      logger.error(`Controller createStaffAccount | ${error.message}`);
    } else if (error.field) {
      logger.error(
        `Controller createStaffAccount | Validation failed | Field ${error.field})}`
      );
    } else {
      logger.error(`Controller createStaffAccount`);
    }
    next(error);
  }
};

const getStaffAccounts = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { search } = req.query;

    logger.info(
      `Controller getStaffAccounts | Admin with ID : ${id} | Get all staff accounts`
    );

    const page = parseInt(req.query.page) || 1;
    const LIMIT = 10;
    const keyword = search
      ? {
          role: 'staff',
          is_deleted: false,
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              email: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {
          role: 'staff',
          is_deleted: false,
        };
    const skip = (page - 1) * LIMIT;

    const { data, count } = await getAllStaff(skip, LIMIT, keyword);

    res.status(200).json({
      success: true,
      statusCode: 200,
      data,
      totalCount: count,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      error.message = 'Internal Server Error';
      return logger.error(
        `Controller getStaffAccounts | Failed to get data from database`
      );
    } else if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
      logger.error(`Controller getStaffAccounts | -  ${error.message}`);
    } else {
      logger.error(`Controller getStaffAccounts`);
    }
    next(error);
  }
};

const updateStaffAccount = async (req, res, next) => {
  try {
    const { id } = req.user;
    const paramsId = req.params.id;
    const { name, password } = req.body;

    logger.info(
      `Controller updateStaffAccount | Admin with ID : ${id} | Updating staff account ID : ${paramsId} - Name : ${name}`
    );

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

    await updateStaff(paramsId, { name, password });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Staff account updated successfully',
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
      logger.error(
        `Controller updateStaffAccount | Failed insert data to database`
      );
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      error.message = 'Internal Server Error';
      logger.error(
        `Controller updateStaffAccount | Failed to get data from database`
      );
    } else if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
      logger.error(`Controller updateStaffAccount | ${error.message}`);
    } else if (error.field) {
      logger.error(
        `Controller updateStaffAccount | Validation failed | Field ${error.field})}`
      );
    } else {
      logger.error(`Controller updateStaffAccount`);
    }
    next(error);
  }
};

const deleteStaffAccount = async (req, res, next) => {
  try {
    const { id } = req.user;
    const paramsId = req.params.id;

    logger.info(
      `Controller deleteStaffAccount | Admin with ID : ${id} | Deleting staff account with ID : ${paramsId}`
    );

    await deleteStaff(paramsId);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Staff account deleted successfully',
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientValidationError) {
      error.message = 'Internal Server Error';
      return logger.error(
        `Controller deleteStaffAccount | Failed to get data from database`
      );
    } else if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
      logger.error(`Controller deleteStaffAccount | ${error.message}`);
    } else {
      logger.error(`Controller deleteStaffAccount`);
    }
    next(error);
  }
};

module.exports = {
  createStaffAccount,
  getStaffAccounts,
  updateStaffAccount,
  deleteStaffAccount,
};
