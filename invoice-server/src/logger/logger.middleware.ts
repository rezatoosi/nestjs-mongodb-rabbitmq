import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger, LoggerOptions } from 'winston';
import * as winston from 'winston';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) { }

  use(req: Request, res: Response, next: () => void) {
    const start = Date.now();
    const userAgent = req.get('user-agent') || 'unknown';
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const contentLength = req.get('content-length') || 0;

    res.on('finish', () => {
      const ms = Date.now() - start;
      this.logger.log('info', `{ ${ip} ${req.method} ${req.originalUrl} ${userAgent} ${res.statusCode} ${contentLength} } ${ms}ms`);
    });

    next();
  }
}

const errorFilter = winston.format((info, opts) => {
  console.log('info', info);
  return info.level === 'error' ? info : false;
});

export const Options: LoggerOptions = {
  level: process.env.LOG_LEVEL || 'info',
  transports: [
    new winston.transports.Console({}),
    new winston.transports.File({
      filename: 'app.log',
      dirname: 'logs',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        // errorFilter(),
      ),
    }),
  ],
};
