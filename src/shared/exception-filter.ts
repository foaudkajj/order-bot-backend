import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {HttpAdapterHost} from '@nestjs/core';
import {QueryFailedError} from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const {httpAdapter} = this.httpAdapterHost;

    const ctx = host.switchToHttp();

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

      default:
        break;
    }

    const responseBody = {
      message: message,
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
