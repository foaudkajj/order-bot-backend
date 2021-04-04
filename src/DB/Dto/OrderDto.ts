import { OrderDetails } from "../models/OrderDetails";
import { Customer } from "../models/Customer";

export class OrderDto {

    Id?: number;
    OrderNo: string;
    TotalPrice: number;
    OrderStatus?: number;
    CreateDate: Date;
    Description?: string;
    customerId: number;
    customer?: Customer;
    OrderDetails?: OrderDetails[];
    OperationItems: any[];
}