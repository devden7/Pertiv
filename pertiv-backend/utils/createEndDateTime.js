const { addHours, addDays } = require('date-fns');

const endDate24Hours = () => {
  return addHours(new Date(), 24);
};

const endDateBorrowed = (duration) => {
  return addDays(new Date(), duration);
};

module.exports = { endDate24Hours, endDateBorrowed };
