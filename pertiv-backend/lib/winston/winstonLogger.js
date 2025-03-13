const { PrismaClient } = require('@prisma/client');
const winston = require('winston');

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
  transports: [new winston.transports.Console()],
});

logger.on('data', (info) => {
  insertLogToDatabase(info.level, info.message);
});

const insertLogToDatabase = async (level, message) => {
  const prisma = new PrismaClient();
  await prisma.log.create({
    data: {
      level,
      message,
    },
  });
};

module.exports = logger;
