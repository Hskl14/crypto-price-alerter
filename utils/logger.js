const config = require('../config');
const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');


const customLevels = {
    levels: {
      critical: 0,
      error: 1,
      warn: 2,
      info: 3,
      debug: 4
    },
};

const logger = createLogger({
    levels: customLevels.levels,
    level: config.log.level || 'info',
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
    ),
    transports: [
        new transports.Console(),
        new DailyRotateFile({
        filename: `${config.log.filename}-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: false,
        maxSize: '20m',
        maxFiles: '14d'
        })
    ]
});


module.exports = logger;
