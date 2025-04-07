function generateBorrowId() {
  const pickNumber = Math.random() * 999999;
  const randomNumber = Math.floor(pickNumber);
  return `#PTB${randomNumber}`;
}

module.exports = generateBorrowId;
