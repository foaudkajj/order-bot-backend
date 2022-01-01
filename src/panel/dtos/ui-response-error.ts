export class UIResponseError<T> extends Error {
  statusCode: number;
  isError: boolean;
  error?: any;
  messageKey: string;
}
