import express, { Request, Response } from "express";
import { validate } from "./validator";
import pgp from "pg-promise";
const app = express();
app.use(express.json());

app.post("/checkout", async function (req: Request, res: Response) {
  const connection = pgp()(
    "postgres://postgres:123456@localhost:5432/ricardomiguez"
  );
  try {
    const isValid = validate(req.body.taxNumber);
    if (!isValid) throw new Error("Invalid tax number");
    const output: Output = { total: 0, shipping: 0 };
    const items: number[] = [];
    if (req.body.items) {
      for (const item of req.body.items) {
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
    if (req.body.coupon) {
      const [couponData] = await connection.query(
        "select * from ccca.coupon where code = $1",
        req.body.coupon
      );
      if (couponData.expire_date.getTime() >= new Date().getTime()) {
        const percentage = parseFloat(couponData.percentage);
        output.total -= (output.total * percentage) / 100;
      }
    }
    if (req.body.from && req.body.to) {
      output.total += output.shipping;
    }
    res.json(output);
  } catch (e: any) {
    res.status(422).json({ message: e.message });
  } finally {
    await connection.$pool.end();
  }
});

type Output = {
  total: number;
  shipping: number;
};

app.listen(3000);
