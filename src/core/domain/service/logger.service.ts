import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      defaultMeta: { service: 'people-analytics-api' },
      transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        }),
      );
    }
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  logRequest(req: any, context?: string) {
    this.logger.info('Request', {
      context,
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      ip: req.ip,
    });
  }

  logResponse(res: any, context?: string) {
    this.logger.info('Response', {
      context,
      statusCode: res.statusCode,
      body: res.body,
    });
  }

  logError(error: Error, context?: string) {
    this.logger.error('Error', {
      context,
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
  }
}
