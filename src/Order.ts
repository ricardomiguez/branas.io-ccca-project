import Item from "./Item";
import Product from "./Product";

export default class Order {
  items: Item[];

  constructor(readonly idOrder: string, taxNumber: string) {
    this.items = [];
  }

  addItem(product: Product, quantity: number) {
    this.items.push(new Item(product.idProduct, product.price, quantity));
  }

  getTotal() {
    let total = 0;
    for (const item of this.items) {
      total += item.price * item.quantity;
    }
    return total;
  }
}
