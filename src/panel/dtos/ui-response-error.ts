import {HttpException, HttpStatus} from '@nestjs/common';

export class UIResponseError extends HttpException {
  constructor() {
    super('Error', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  statusCode: number;
  errorCode?: string;
  error?: any;
  messageKey: string;
}
