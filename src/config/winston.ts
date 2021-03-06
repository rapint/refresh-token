import { resolve } from 'path';
import winston from 'winston';

const options = {
  file: {
    level: 'info',
    filename: `${resolve(__dirname, '..', '..')}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880,
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false,
});

export class LoggerStream {
  write(message: string) {
    console.log(message);
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  }
}

export default logger;
