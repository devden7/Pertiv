const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { EMAIL_ADMIN, PASSWORD_ADMIN } = require('../../config/env');

const prisma = new PrismaClient();

const createAdminAccount = async () => {
  try {
    const findAdminQuery = await prisma.user.findUnique({
      where: {
        email: EMAIL_ADMIN,
      },
    });

    if (findAdminQuery) throw new Error('Admin is already Exist');

    await prisma.user.create({
      data: {
        name: 'admin',
        email: EMAIL_ADMIN,
        password: bcrypt.hashSync(PASSWORD_ADMIN, 10),
        role: 'admin',
      },
    });

    console.log('Success creating admin account');
  } catch (error) {
    console.log(error);
  }
};

createAdminAccount();
