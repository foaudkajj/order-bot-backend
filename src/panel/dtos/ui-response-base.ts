export interface UIResponseBase<T> {
  statusCode: number;
  isError: boolean;
  error?: any;
  messageKey: string;
  result?: T;
  data?: T[];
  totalCount?: number;
  groupCount?: number;
  summary?: any[];
}
