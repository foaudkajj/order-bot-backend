import { OrderStatus } from "src/DB/enums/OrderStatus";
import { Order } from "src/DB/models/Order";
import { EntityRepository, getCustomRepository, getRepository, Repository } from "typeorm";
import { BotContext } from "../interfaces/BotContext";
import { CustomerRepository } from "./CustomerRepository";


@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
    async getOrdersInBasketByStatus(ctx: BotContext, orderStatus: OrderStatus, relations?: string[]) {
        const customerRepository = getCustomRepository(CustomerRepository);
        // const userInfo = ctx.from.is_bot ? ctx.callbackQuery.from : ctx.from;
        const userInfo = await customerRepository.getUser(ctx);
        const order = (await this.findOne({ where: { customerId: userInfo.Id, OrderStatus: orderStatus }, relations: relations, order: { CreateDate: 'DESC' } }));
        return order;
    }

}