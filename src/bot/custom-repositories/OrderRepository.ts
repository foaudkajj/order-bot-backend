import { OrderStatus } from "src/DB/enums/OrderStatus";
import { Order } from "src/DB/models/Order";
import { EntityRepository, getRepository, Repository } from "typeorm";
import { BotContext } from "../interfaces/BotContext";

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
    async getOrdersInBasketByStatus(ctx: BotContext, orderStatus: OrderStatus, relations?: string[]) {

        const userInfo = ctx.from.is_bot ? ctx.callbackQuery.from : ctx.from;
        const order = (await this.findOne({ where: { userId: userInfo.id, Status: orderStatus }, relations: relations, order: { CreateDate: 'DESC' } }));
        return order;
    }

}