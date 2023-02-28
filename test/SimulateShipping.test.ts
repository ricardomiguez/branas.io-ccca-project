import SimulateShipping from "../src/SimulateShipping";

let simulateShipping: SimulateShipping;

beforeEach(function () {
  simulateShipping = new SimulateShipping();
});

test("Should calculate the shipping cost of an order with 3 products", async function () {
  const input = {
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
    ],
    from: "22060030",
    to: "88015600",
  };
  const output = await simulateShipping.execute(input);
  expect(output.shipping).toBe(280);
});
