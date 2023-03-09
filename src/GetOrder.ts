import OrderRepository from "./OrderRepository";
import orderRepositoryDatabase from "./OrderRepositoryDatabase";

export default class GetOrder {
  constructor(
    readonly orderRepository: OrderRepository = new orderRepositoryDatabase()
  ) {}

  async execute(id: string): Promise<Output> {
    const order = await this.orderRepository.getById(id);
    const output: Output = {
      code: order.getCode(),
      total: order.getTotal(),
      shipping: order.shipping,
    };
    return output;
  }
}

type Output = {
  code: string;
  total: number;
  shipping: number;
};
