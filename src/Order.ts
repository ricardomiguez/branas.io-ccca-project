import CurrencyTable from "./CurrencyTable";
import Item from "./Item";
import Product from "./Product";
import TaxNumber from "./TaxNumber";

export default class Order {
  items: Item[];
  taxNumber: TaxNumber;

  constructor(
    readonly idOrder: string,
    taxNumber: string,
    readonly currencyTable: CurrencyTable = new CurrencyTable()
  ) {
    this.items = [];
    this.taxNumber = new TaxNumber(taxNumber);
  }

  addItem(product: Product, quantity: number) {
    if (quantity <= 0) throw new Error("Invalid quantity");
    if (this.items.some((item: Item) => item.idProduct === product.idProduct))
      throw new Error("Duplicated item");
    this.items.push(
      new Item(product.idProduct, product.price, quantity, product.currency)
    );
  }

  getTotal() {
    let total = 0;
    for (const item of this.items) {
      total +=
        item.price *
        item.quantity *
        this.currencyTable.getCurrency(item.currency);
    }
    return total;
  }
}
