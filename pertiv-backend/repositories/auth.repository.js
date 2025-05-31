const prisma = require('../utils/prismaConnection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const { formatISO } = require('date-fns');

const loginAuth = async (data) => {
  const { email, password } = data;
  const dataQuery = await prisma.user.findUnique({
    where: { email },
  });

  if (!dataQuery) {
    const error = new Error('Email not registered');
    error.success = false;
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, dataQuery.password);

  if (!isMatch) {
    const error = new Error('Your password is wrong');
    error.success = false;
    error.statusCode = 401;
    throw error;
  }

  return dataQuery;
};

const getToken = (findUserQuery) => {
  return jwt.sign(
    {
      id: findUserQuery.id,
      email: findUserQuery.email,
      name: findUserQuery.name,
      role: findUserQuery.role,
      image: findUserQuery.image,
    },
    JWT_SECRET,
    {
      expiresIn: '1d',
    }
  );
};

const registerAccount = async (data) => {
  const { email, name, password } = data;

  await prisma.user.create({
    data: {
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      role: 'user',
      image: null,
    },
  });
};

const findPenaltyAccount = async (userId) => {
  let findPenaltyQuery = await prisma.penalty.findMany({
    where: {
      bookBorrowed: {
        userId,
      },
      type: 'active',
    },
    select: {
      id: true,
      type: true,
      price: true,
      start_date: true,
      end_date: true,
    },
  });

  if (findPenaltyQuery.length > 0) {
    const dateNow = formatISO(new Date());
    const dateDuePenalty = formatISO(findPenaltyQuery[0].end_date);

    if (dateNow > dateDuePenalty) {
      findPenaltyQuery = await prisma.penalty.update({
        where: {
          id: findPenaltyQuery[0].id,
          bookBorrowed: {
            userId,
          },
          type: 'active',
        },
        data: {
          type: 'inactive',
        },
      });
    }
  }

  return findPenaltyQuery;
};

const findMembershipAccount = async (userId) => {
  let findUserMembership = await prisma.membershipTransaction.findMany({
    where: {
      user_id: userId,
      status: 'active',
    },
    orderBy: {
      start_date: 'desc',
    },
  });

  if (findUserMembership.length > 0) {
    const dateNow = formatISO(new Date());
    const dateEndMembership = formatISO(findUserMembership[0].end_date);

    if (dateNow > dateEndMembership) {
      findUserMembership = await prisma.membershipTransaction.update({
        where: {
          id: findUserMembership[0].id,
          status: 'active',
        },
        data: {
          status: 'inactive',
        },
      });
    }
  }

  return findUserMembership;
};

module.exports = {
  loginAuth,
  getToken,
  registerAccount,
  findPenaltyAccount,
  findMembershipAccount,
};
