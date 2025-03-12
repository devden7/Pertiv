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
    const findDataQuery = await prisma.user.findMany({
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
      data: findDataQuery,
    });
  } catch (error) {
    console.error(error);
  }
};

const getStaffAccountDetail = async (req, res) => {
  try {
    const paramsId = req.params.id;

    const prisma = new PrismaClient();

    const staffDetailQuery = await prisma.user.findUnique({
      where: { id: paramsId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        is_penalty: true,
      },
    });

    if (!staffDetailQuery) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Staff not found',
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: staffDetailQuery,
    });
  } catch (error) {
    console.error(error);
  }
};

const updateStaffAccount = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: errors.array(),
      });
    }
    const paramsId = req.params.id;

    const { name, email, password } = req.body;
    const prisma = new PrismaClient();

    const findStaffQuery = await prisma.user.findUnique({
      where: { id: paramsId },
    });

    if (!findStaffQuery) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Staff account not found',
      });
    }

    const checkPassword = await bcrypt.compare(password, findStaff.password);

    await prisma.user.update({
      where: { id: paramsId },
      data: {
        name,
        email,
        password: !checkPassword
          ? bcrypt.hashSync(password, 10)
          : findStaff.password,
        role: 'staff',
        is_penalty: false,
      },
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Staff account updated successfully',
    });
  } catch (error) {
    console.error(error);
  }
};

const deleteStaffAccount = async (req, res, next) => {
  try {
    const paramsId = req.params.id;
    const prisma = new PrismaClient();
    const findStaffQuery = await prisma.user.findUnique({
      where: { id: paramsId },
    });

    if (!findStaffQuery) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Staff not found',
      });
    }

    await prisma.user.delete({
      where: { id: paramsId },
    });
    findStaffQuery.password = res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Staff account deleted successfully',
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  createStaffAccount,
  getStaffAccounts,
  getStaffAccountDetail,
  updateStaffAccount,
  deleteStaffAccount,
};
