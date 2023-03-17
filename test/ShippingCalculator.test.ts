import Product from "../src/domain/entity/Product";
import ShippingCalculator from "../src/domain/entity/ShippingCalculator";

test("Should calculate product shipping", async function () {
  const input = new Product(6, "A", 1000, 100, 30, 10, 3, "USD");
  const output = ShippingCalculator.calculate(input);
  expect(output).toBe(30);
});
