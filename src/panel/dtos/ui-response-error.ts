import {HttpException, HttpStatus} from '@nestjs/common';

export class UIResponseError extends HttpException {
  constructor(
    message?: string,
    errorCode?: string,
    statusCode: HttpStatus = HttpStatus.FORBIDDEN,
  ) {
    super(message, statusCode);
    this.errorCode = errorCode;
  }

  errorCode?: string;
}
