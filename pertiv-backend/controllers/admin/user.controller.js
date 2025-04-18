const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const logger = require('../../lib/winston/winstonLogger');
const prisma = require('../../utils/prismaConnection');

const createStaffAccount = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    logger.info(
      `Controller createStaffAccount - Create staff account Name : ${name} - Email : ${email}`
    );

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error();
      error.success = false;
      error.statusCode = 400;
      error.message = errors.array();
      throw error;
    }

    await prisma.user.create({
      data: {
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        role: 'staff',
      },
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Staff account created successfully',
    });
  } catch (error) {
    logger.error(
      `ERROR Controller createStaffAccount - ${JSON.stringify(error)}`
    );

    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const getStaffAccounts = async (req, res, next) => {
  try {
    logger.info('Controller getStaffAccounts - Get all staff accounts');
    const { search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const LIMIT = 10;
    const skip = (page - 1) * LIMIT;
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

    const findDataQuery = await prisma.user.findMany({
      where: keyword,
      skip,
      take: LIMIT,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      },
    });

    const countOrder = await prisma.user.count({
      where: keyword,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: findDataQuery,
      totalCount: countOrder,
    });
  } catch (error) {
    logger.error(`ERROR Controller getStaffAccounts  -  ${error}`);

    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const getStaffAccountDetail = async (req, res, next) => {
  try {
    const paramsId = req.params.id;

    logger.info(
      `Controller getStaffAccountDetail - Get staff account detail ID : ${paramsId}`
    );

    const staffDetailQuery = await prisma.user.findUnique({
      where: { id: paramsId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        is_penalty: true,
      },
    });

    if (!staffDetailQuery) {
      const error = new Error('Staff account not found');
      error.success = false;
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: staffDetailQuery,
    });
  } catch (error) {
    logger.error(`ERROR Controller getStaffAccountDetail - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const updateStaffAccount = async (req, res, next) => {
  try {
    const paramsId = req.params.id;
    const { name, password } = req.body;

    logger.info(
      `Controller updateStaffAccount - Updating staff account with ID : ${paramsId} - Name : ${name} `
    );

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error();
      error.success = false;
      error.statusCode = 400;
      error.message = errors.array();
      throw error;
    }

    const findStaffQuery = await prisma.user.findUnique({
      where: { id: paramsId },
    });

    if (!findStaffQuery) {
      const error = new Error('Staff account not found');
      error.success = false;
      error.statusCode = 404;
      throw error;
    }

    const checkPassword = await bcrypt.compare(
      password,
      findStaffQuery.password
    );

    await prisma.user.update({
      where: { id: paramsId },
      data: {
        name,
        password:
          password !== '' && !checkPassword
            ? bcrypt.hashSync(password, 10)
            : findStaffQuery.password,
        role: 'staff',
      },
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Staff account updated successfully',
    });
  } catch (error) {
    logger.error(
      `ERROR Controller updateStaffAccount - ${JSON.stringify(error)}`
    );

    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const deleteStaffAccount = async (req, res, next) => {
  try {
    const paramsId = req.params.id;
    logger.info(
      `Controller deleteStaffAccount - Deleting staff account with ID : ${paramsId}`
    );

    const findStaffQuery = await prisma.user.findUnique({
      where: { id: paramsId },
    });

    if (!findStaffQuery) {
      const error = new Error('Staff account not found');
      error.success = false;
      error.statusCode = 404;
      throw error;
    }

    await prisma.user.update({
      where: { id: paramsId },
      data: {
        is_deleted: true,
      },
    });
    findStaffQuery.password = res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Staff account deleted successfully',
    });
  } catch (error) {
    logger.error(`ERROR Controller deleteStaffAccount - ${error}`);

    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

module.exports = {
  createStaffAccount,
  getStaffAccounts,
  getStaffAccountDetail,
  updateStaffAccount,
  deleteStaffAccount,
};
