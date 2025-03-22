const { addHours } = require('date-fns');

const endDate24Hours = () => {
  return addHours(new Date(), 24);
};

module.exports = endDate24Hours;
