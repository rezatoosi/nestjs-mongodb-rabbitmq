import { createLogger, format, LoggerOptions, transports } from 'winston';

const fromat = format.printf(({ timestamp, level, stack, message }) => {
  return `${timestamp} - [${level.toUpperCase().padEnd(7)}] - ${stack || message}`;
});

const errorFileOptions: transports.FileTransportOptions = {
  filename: 'error.log',
  dirname: 'logs',
  level: 'error',
};

const infoFileOptions: transports.FileTransportOptions = {
  filename: 'info.log',
  dirname: 'logs',
  level: 'silly',
};

const consoleOptions: transports.ConsoleTransportOptions = {
  level: 'silly',
};

const loggerOptions: LoggerOptions = {
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    fromat,
  ),
  transports: [
    new transports.Console(consoleOptions),
    new transports.File(errorFileOptions),
    new transports.File(infoFileOptions),
  ],
};

export const loggerInstance = createLogger(loggerOptions);
