function generateLoanKey() {
  const pickNumber = Math.random() * 999999;
  const randomNumber = Math.floor(pickNumber);
  return `#PTLK${randomNumber}`;
}

module.exports = generateLoanKey;
