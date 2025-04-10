const logger = require('../../lib/winston/winstonLogger');
const prisma = require('../../utils/prismaConnection');
const { formatISO, addDays, format } = require('date-fns');
const getMemberships = async (req, res, next) => {
  try {
    logger.info('Controller USER getMemberships - Get all membership type');
    const findMembershipQuery = await prisma.membership.findMany();

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: findMembershipQuery,
    });
  } catch (error) {
    logger.error(`ERROR USER Controller getMemberships  -  ${error}`);

    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const subscribeMembership = async (req, res, next) => {
  try {
    const { id } = req.user;
    const paramsId = req.params.id;

    logger.info(`Controller USER subscribeMembership - user: ${id}`);

    const findMembershipQuery = await prisma.membership.findUnique({
      where: {
        id: paramsId,
      },
    });

    if (!findMembershipQuery) {
      const error = new Error('Membership not found');
      error.success = false;
      error.statusCode = 404;
      throw error;
    }

    const findMembershipTransactionQuery =
      await prisma.membershipTransaction.findMany({
        where: {
          user_id: id,
          membership_id: paramsId,
        },
        orderBy: {
          start_date: 'desc',
        },
      });

    if (findMembershipTransactionQuery.length > 0) {
      const dateNow = formatISO(new Date());
      const endDate = formatISO(findMembershipTransactionQuery[0].end_date);
      console.log(dateNow);
      if (endDate > dateNow) {
        const error = new Error('You already subscribe this membership');
        error.success = false;
        error.statusCode = 400;
        throw error;
      }
    }

    await prisma.membershipTransaction.create({
      data: {
        name: findMembershipQuery.name,
        description: findMembershipQuery.description,
        durationDays: findMembershipQuery.durationDays,
        maxBorrow: findMembershipQuery.maxBorrow,
        maxReturn: findMembershipQuery.maxReturn,
        price: findMembershipQuery.price,
        user_id: id,
        membership_id: findMembershipQuery.id,
        start_date: formatISO(new Date()),
        end_date: formatISO(
          addDays(new Date(), findMembershipQuery.durationDays)
        ),
      },
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Subscription successfully',
    });
  } catch (error) {
    logger.error('Error USER Controller subscribeMembership:', error);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

module.exports = {
  getMemberships,
  subscribeMembership,
};
