import ShippingCalculator from "../src/ShippingCalculator";

test("Should calculate product shipping", async function () {
  const input = {
    idProduct: 6,
    description: "A",
    price: 1000,
    width: 100,
    height: 30,
    length: 10,
    weight: 3,
    currency: "USD",
  };
  const output = ShippingCalculator.calculate(input);
  expect(output).toBe(30);
});
