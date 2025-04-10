const { validationResult } = require('express-validator');
const logger = require('../../lib/winston/winstonLogger');
const prisma = require('../../utils/prismaConnection');

const createMembership = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { name, description, durationDays, maxBorrow, maxReturn, price } =
      req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error();
      error.success = false;
      error.statusCode = 400;
      error.message = errors.array();
      throw error;
    }

    logger.info(
      `Controller STAFF createMembership - staff: ${id}  name : ${name}, description : ${description}, price : ${price}, durationDays : ${durationDays}, maxBorrow : ${maxBorrow}, maxReturn : ${maxReturn}`
    );

    await prisma.membership.create({
      data: {
        name: name.toLowerCase(),
        description,
        durationDays,
        maxBorrow,
        maxReturn,
        price,
      },
    });
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Membership created successfully',
    });
  } catch (error) {
    logger.error(
      'Error STAFF Controller creatingMembership:',
      JSON.stringify(error)
    );
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const getMemberships = async (req, res, next) => {
  try {
    logger.info('Controller STAFF getMemberships - Get all membership type');
    const page = parseInt(req.query.page) || 1;
    const LIMIT = 10;
    const skip = (page - 1) * LIMIT;
    const findMembershipQuery = await prisma.membership.findMany({
      skip,
      take: LIMIT,
    });

    const countMembership = await prisma.membership.count();

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: findMembershipQuery,
      totalCount: countMembership,
    });
  } catch (error) {
    logger.error(`ERROR STAFF Controller getMemberships  -  ${error}`);

    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const updateMembershipType = async (req, res, next) => {
  try {
    const { id } = req.user;
    const paramsId = req.params.id;
    const { name, description, durationDays, maxBorrow, maxReturn, price } =
      req.body;

    logger.info(
      `Controller STAFF updateMembershipType - staff: ${id}, membeshipId: ${paramsId}  name : ${name}, description : ${description}, price : ${price}, durationDays : ${durationDays}, maxBorrow : ${maxBorrow}, maxReturn : ${maxReturn}`
    );

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error();
      error.success = false;
      error.statusCode = 400;
      error.message = errors.array();
      throw error;
    }

    const findMembershipQuery = await prisma.membership.findUnique({
      where: { id: paramsId },
    });

    if (!findMembershipQuery) {
      const error = new Error('Membership type not found');
      error.success = false;
      error.statusCode = 404;
      throw error;
    }

    await prisma.membership.update({
      where: { id: paramsId },
      data: {
        name: name.toLowerCase(),
        description,
        durationDays,
        maxBorrow,
        maxReturn,
        price,
      },
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Membership updated successfully',
    });
  } catch (error) {
    logger.error(
      `ERROR STAFF Controller updateMembershipType - ${JSON.stringify(error)}`
    );

    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

module.exports = {
  createMembership,
  getMemberships,
  updateMembershipType,
};
