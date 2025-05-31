const authRepository = require('../repositories/auth.repository');

const login = async (data) => {
  const findUserQuery = await authRepository.loginAuth(data);
  const token = authRepository.getToken(findUserQuery);

  return { findUserQuery, token };
};

const register = async (data) => {
  await authRepository.registerAccount(data);
};

const accountInfo = async (userId) => {
  const penaltyAccount = await authRepository.findPenaltyAccount(userId);
  const membershipAccount = await authRepository.findMembershipAccount(userId);
  return { penaltyAccount, membershipAccount };
};
module.exports = {
  login,
  register,
  accountInfo,
};
