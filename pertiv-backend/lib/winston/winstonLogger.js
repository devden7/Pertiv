const path = require('path');
const winston = require('winston');
const prisma = require('../../utils/prismaConnection');

let getDate = () =>
  new Date().toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
  });

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: getDate,
    }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.resolve(__dirname, 'logInformation.log'),
    }),
  ],
});

logger.on('data', (info) => {
  insertLogToDatabase(info.level, info.message);
});

const insertLogToDatabase = async (level, message) => {
  await prisma.log.create({
    data: {
      level,
      message,
    },
  });
};

module.exports = logger;
