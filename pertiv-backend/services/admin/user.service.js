const userRepository = require('../../repositories/admin/user.repository');

const createUser = async (data) => {
  return await userRepository.createStaffAccount(data);
};

const getAllStaff = async (skip, limit, keyword) => {
  const data = await userRepository.getAllStaffAccounts(skip, limit, keyword);
  const count = await userRepository.count(keyword);

  return {
    data,
    count,
  };
};

const updateStaff = async (staffId, data) => {
  return await userRepository.updateStaffAccount(staffId, data);
};

const deleteStaff = async (staffId) => {
  return await userRepository.deleteStaffAccount(staffId);
};

module.exports = {
  createUser,
  getAllStaff,
  updateStaff,
  deleteStaff,
};
