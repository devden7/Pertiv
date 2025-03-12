require('dotenv').config();

const { PORT_LISTEN, EMAIL_ADMIN, PASSWORD_ADMIN, JWT_SECRET } = process.env;

module.exports = {
  PORT_LISTEN,
  EMAIL_ADMIN,
  PASSWORD_ADMIN,
  JWT_SECRET,
};
