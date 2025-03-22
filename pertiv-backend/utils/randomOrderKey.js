function generateOrderKey() {
  const pickNumber = Math.random() * 999999;
  const randomNumber = Math.floor(pickNumber);
  return `#PTK${randomNumber}`;
}

module.exports = generateOrderKey;
