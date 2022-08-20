export interface UIResponseBase<T = {}> {
  data?: T;
  totalCount?: number;
  groupCount?: number;
  summary?: any[];
}
