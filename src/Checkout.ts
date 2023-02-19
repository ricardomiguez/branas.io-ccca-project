import pgp from "pg-promise";
import { validate } from "./validator";

export default class Checkout {
  async execute(input: Input): Promise<Output> {
    const connection = pgp()(
      "postgres://postgres:123456@localhost:5432/ricardomiguez"
    );
    const isValid = validate(input.taxNumber);
    if (!isValid) throw new Error("Invalid tax number");
    const output: Output = { total: 0, shipping: 0 };
    const items: number[] = [];
    if (input.items) {
      for (const item of input.items) {
        if (item.quantity <= 0) throw new Error("Invalid quantity");
        if (items.includes(item.idProduct)) throw new Error("Duplicated item");
        const [productData] = await connection.query(
          "select * from ccca.product where id_product = $1",
          item.idProduct
        );
        if (
          productData.width <= 0 ||
          productData.height <= 0 ||
          productData.lenght <= 0 ||
          parseFloat(productData.weight) <= 0
        )
          throw new Error("Invalid dimension");
        output.total += parseFloat(productData.price) * item.quantity;
        const volume =
          ((((productData.width / 100) * productData.height) / 100) *
            productData.lenght) /
          100;
        const density = parseFloat(productData.weight) / volume;
        const itemShipping = 1000 * volume * (density / 100);
        output.shipping += Math.max(itemShipping, 10) * item.quantity;
        items.push(item.idProduct);
      }
    }
    if (input.coupon) {
      const [couponData] = await connection.query(
        "select * from ccca.coupon where code = $1",
        input.coupon
      );
      if (couponData.expire_date.getTime() >= new Date().getTime()) {
        const percentage = parseFloat(couponData.percentage);
        output.total -= (output.total * percentage) / 100;
      }
    }
    if (input.from && input.to) {
      output.total += output.shipping;
    }
    await connection.$pool.end();
    return output;
  }
}

type Input = {
  taxNumber: string;
  items: { idProduct: number; quantity: number }[];
  coupon?: string;
  from?: string;
  to?: string;
};

type Output = {
  total: number;
  shipping: number;
};