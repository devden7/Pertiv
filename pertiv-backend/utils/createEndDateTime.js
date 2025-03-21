const endDate24Hours = () => {
  const now = new Date();
  now.setHours(now.getHours() + 24);
  const hours = 7;
  const minutes = 60;
  const offsetWIB = hours * minutes;
  const milidetik = 60000;

  return new Date(now.getTime() + offsetWIB * milidetik);
};

module.exports = endDate24Hours;
