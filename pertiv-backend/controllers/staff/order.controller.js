const logger = require('../../lib/winston/winstonLogger');
const prisma = require('../../utils/prismaConnection');

const transactions = async (req, res, next) => {
  try {
    const { id } = req.user;
    logger.info(`Controller STAFF transactions -  User ID : ${id}`);
    const findOrderQuery = await prisma.order.findMany({
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

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Access transaction history',
      data,
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

module.exports = { transactions };
