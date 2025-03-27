const { formatISO } = require('date-fns/formatISO');
const logger = require('../../lib/winston/winstonLogger');
const prisma = require('../../utils/prismaConnection');

const transactions = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const LIMIT = 10;
    const skip = (page - 1) * LIMIT;
    const keyword = search
      ? {
          OR: [
            {
              user: {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
            {
              id: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {};

    logger.info(`Controller STAFF transactions -  User ID : ${id}`);
    const findOrderQuery = await prisma.order.findMany({
      skip,
      take: LIMIT,
      orderBy: {
        created_at: 'desc',
      },
      where: keyword,
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
        item_orders: true,
      },
    });

    if (!findOrderQuery) {
      const error = new Error('Orders History not found');
      error.success = false;
      error.statusCode = 404;
      throw error;
    }
    const data = findOrderQuery.map((item) => ({
      id: item.id,
      status: item.status,
      buy_key: item.buy_key,
      buy_handled_by: item.buy_handled_by,
      buy_date: item.buy_date,
      total_price: item.total_price,
      created_at: item.created_at,
      ended_at: item.ended_at,
      canceled_at: item.canceled_at,
      paid_at: item.paid_at,
      userId: item.userId,
      user: item.user,
      item_order: item.item_orders.map((order) => ({
        id: order.id,
        book_title: order.book_title,
        book_imageUrl: order.book_imageUrl,
        book_price: order.book_price,
        quantity: order.quantity,
      })),
    }));

    const countOrder = await prisma.order.count({
      where: keyword,
    });
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Access transaction history',
      data,
      totalCount: countOrder,
    });
  } catch (error) {
    logger.error(`ERROR STAFF Controller transactions - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

const confirmOrder = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { orderKey } = req.body;
    logger.info(`Controller STAFF confirmOrder -  Staff ID : ${id}`);

    const findStaffQuery = await prisma.user.findUnique({
      where: {
        id,
        role: 'staff',
      },
    });

    if (!findStaffQuery) {
      const error = new Error('Staff not found');
      error.success = false;
      error.statusCode = 404;
      throw error;
    }

    const findOrderQuery = await prisma.order.findUnique({
      where: {
        buy_key: orderKey,
        status: 'paid',
      },
    });

    if (!findOrderQuery) {
      const error = new Error('invalid Order');
      error.success = false;
      error.statusCode = 400;
      throw error;
    }

    await prisma.order.update({
      where: {
        id: findOrderQuery.id,
        status: findOrderQuery.status,
      },
      data: {
        status: 'success',
        buy_handled_by: findStaffQuery.email,
        buy_date: formatISO(new Date()),
      },
    });
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Successfully confirm order',
    });
  } catch (error) {
    logger.error(`ERROR STAFF Controller confirmOrder - ${error}`);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Internal Server Error';
    }
    next(error);
  }
};

module.exports = { transactions, confirmOrder };
