import Product from "../src/Product";
import ShippingCalculator from "../src/ShippingCalculator";

test("Should calculate product shipping", async function () {
  const input = new Product(6, "A", 1000, 100, 30, 10, 3, "USD");
  const output = ShippingCalculator.calculate(input);
  expect(output).toBe(30);
});
