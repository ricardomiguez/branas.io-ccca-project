import Item from "./Item";
import Product from "./Product";
import TaxNumber from "./TaxNumber";

export default class Order {
  items: Item[];
  taxNumber: TaxNumber;

  constructor(readonly idOrder: string, taxNumber: string) {
    this.items = [];
    this.taxNumber = new TaxNumber(taxNumber);
  }

  addItem(product: Product, quantity: number) {
    if (this.items.some((item: Item) => item.idProduct === product.idProduct))
      throw new Error("Duplicated item");
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
