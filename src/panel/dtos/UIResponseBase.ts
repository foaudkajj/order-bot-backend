export interface UIResponseBase<T> {
    StatusCode: number;
    IsError: boolean;
    MessageKey: string;
    Result: T;
    data?: T[];
    totalCount?: number;
    groupCount?: number;
    summary?: any[];
}