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
      `Controller STAFF createMembership -staff: ${id}  name : ${name}, description : ${description}, price : ${price}, durationDays : ${durationDays}, maxBorrow : ${maxBorrow}, maxReturn : ${maxReturn}`
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
    logger.error('Error STAFF Controller creatingMembership:', error);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

module.exports = {
  createMembership,
};
