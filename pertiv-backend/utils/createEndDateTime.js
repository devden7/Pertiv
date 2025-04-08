const { addHours, addDays } = require('date-fns');

const endDate24Hours = () => {
  return addHours(new Date(), 24);
};

const endDate14Days = () => {
  return addDays(new Date(), 14);
};
module.exports = { endDate24Hours, endDate14Days };
