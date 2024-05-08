import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import {HttpAdapterHost} from '@nestjs/core';
import {WinstonLoggerService} from 'src/logger';
import {QueryFailedError} from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private loggerService: WinstonLoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const {httpAdapter} = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const path = httpAdapter.getRequestUrl(ctx.getRequest());
    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'error';

    switch (exception.constructor) {
      case HttpException:
        httpStatus = (exception as HttpException).getStatus();
        message = (exception as HttpException).message;
        break;

      case QueryFailedError:
        httpStatus = HttpStatus.BAD_REQUEST;
        if ((exception as any)?.code === 'ER_ROW_IS_REFERENCED_2') {
          message = 'ERROR.REFERENCE_ERROR';
        }
        break;

      case UnauthorizedException:
        httpStatus = HttpStatus.UNAUTHORIZED;
        message = 'ERROR.UNAUTHORIZED';
        break;

      default:
        break;
    }

    // log the error
    this.loggerService.error(
      'HttpExceptionFilter: Unhandled exception',
      JSON.stringify({
        exception,
        path,
      }),
    );

    const responseBody = {
      message: message,
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: path,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
