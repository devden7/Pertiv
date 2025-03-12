const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const createStaffAccount = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: errors.array(),
      });
    }
    const { name, email, password } = req.body;
    const prisma = new PrismaClient();
    await prisma.user.create({
      data: {
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        role: 'staff',
        is_penalty: false,
      },
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Staff account created successfully',
    });
  } catch (error) {
    console.error(error);
  }
};

const getStaffAccounts = async (req, res, next) => {
  try {
    const prisma = new PrismaClient();
    const data = await prisma.user.findMany({
      where: { role: 'staff' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        is_penalty: true,
      },
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      data,
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { createStaffAccount, getStaffAccounts };
