function generateReturnedBooknKey() {
  const pickNumber = Math.random() * 999999;
  const randomNumber = Math.floor(pickNumber);
  return `#PTRK${randomNumber}`;
}

module.exports = generateReturnedBooknKey;
