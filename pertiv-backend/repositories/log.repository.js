const prisma = require('../utils/prismaConnection');
const baseRepository = require('./base.repository');
const logBaseRepository = baseRepository(prisma.log);

const getAllLogs = async (skip, limit, keyword) => {
  const data = await prisma.log.findMany({
    skip,
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
    where: keyword,
  });

  return data;
};

module.exports = {
  getAllLogs,
  ...logBaseRepository,
};
