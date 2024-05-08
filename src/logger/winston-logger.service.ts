import {Injectable, Scope} from '@nestjs/common';
import {logger} from './winston.config';

/**
 * A class that is used to manage the logging.
 */
@Injectable({scope: Scope.TRANSIENT})
export class WinstonLoggerService {
  log(message: string, context?: string) {
    logger.info(message, {context});
  }

  error(message: string, trace: string, context?: string) {
    logger.error(message, {context, trace});
  }

  warn(message: string, context?: string) {
    logger.warn(message, {context});
  }

  debug(message: string, context?: string) {
    logger.debug(message, {context});
  }
}
