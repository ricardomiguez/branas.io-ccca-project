export default interface OrderRepository {
  save(order: any): Promise<void>;
  getById(id: string): Promise<any>;
  count(): Promise<number>;
}
