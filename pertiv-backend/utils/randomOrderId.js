function generateOrderId() {
  const pickNumber = Math.random() * 999999;
  const randomNumber = Math.floor(pickNumber);
  return `#PTO${randomNumber}`;
}

module.exports = generateOrderId;
