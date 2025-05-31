const { log } = require('winston');
const logRepository = require('../repositories/log.repository');

const getLog = async (skip, limit, keyword) => {
  const data = await logRepository.getAllLogs(skip, limit, keyword);
  const count = await logRepository.count(keyword);
  return {
    data,
    count,
  };
};

module.exports = {
  getLog,
};
