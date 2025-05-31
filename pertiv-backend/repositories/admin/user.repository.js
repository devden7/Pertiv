const prisma = require('../../utils/prismaConnection');
const bcrypt = require('bcryptjs');
const baseRepository = require('../base.repository');
const userBaseRepository = baseRepository(prisma.user);

const createStaffAccount = async (data) => {
  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    },
  });
};

const getAllStaffAccounts = async (skip, limit, keyword) => {
  const findDataQuery = await prisma.user.findMany({
    where: keyword,
    skip,
    take: limit,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
    },
  });

  return findDataQuery;
};

const updateStaffAccount = async (staffId, data) => {
  const findStaffQuery = await prisma.user.findUnique({
    where: { id: staffId },
  });

  if (!findStaffQuery) {
    const error = new Error('Staff account not found');
    error.success = false;
    error.statusCode = 404;
    throw error;
  }

  const checkPassword = await bcrypt.compare(
    data.password,
    findStaffQuery.password
  );

  await prisma.user.update({
    where: { id: staffId },
    data: {
      name: data.name,
      password:
        data.password !== '' && !checkPassword
          ? bcrypt.hashSync(data.password, 10)
          : findStaffQuery.password,
      role: 'staff',
    },
  });
};

const deleteStaffAccount = async (staffId) => {
  const findStaffQuery = await prisma.user.findUnique({
    where: { id: staffId, role: 'staff' },
  });

  if (!findStaffQuery) {
    const error = new Error('Staff account not found');
    error.success = false;
    error.statusCode = 404;
    throw error;
  }

  await prisma.user.update({
    where: { id: staffId },
    data: {
      is_deleted: true,
    },
  });
};
module.exports = {
  createStaffAccount,
  getAllStaffAccounts,
  updateStaffAccount,
  deleteStaffAccount,
  ...userBaseRepository,
};
