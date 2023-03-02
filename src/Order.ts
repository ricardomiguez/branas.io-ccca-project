export default class Order {
  constructor(readonly idOrder: string, taxNumber: string) {}

  getTotal() {
    return 0;
  }
}
