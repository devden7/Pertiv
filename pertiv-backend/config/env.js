require('dotenv').config();

const { PORT_LISTEN, EMAIL_ADMIN, PASSWORD_ADMIN } = process.env;

module.exports = {
  PORT_LISTEN,
  EMAIL_ADMIN,
  PASSWORD_ADMIN,
};
