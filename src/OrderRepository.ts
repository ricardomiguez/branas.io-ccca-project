import Order from "./Order";

export default interface OrderRepository {
  save(order: Order): Promise<void>;
  getById(id: string): Promise<Order>;
  count(): Promise<number>;
}
