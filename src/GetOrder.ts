import OrderRepository from "./OrderRepository";
import orderRepositoryDatabase from "./OrderRepositoryDatabase";

export default class GetOrder {
  constructor(
    readonly orderRepository: OrderRepository = new orderRepositoryDatabase()
  ) {}

  async execute(id: string): Promise<Output> {
    const output: Output = { code: "", total: 0, shipping: 0 };
    const orderData = await this.orderRepository.getById(id);
    output.code = orderData.code;
    output.total = parseFloat(orderData.total);
    output.shipping = parseFloat(orderData.shipping);
    return output;
  }
}

type Output = {
  code: string;
  total: number;
  shipping: number;
};
