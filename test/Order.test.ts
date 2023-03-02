import crypto from "crypto";
import Order from "../src/Order";

test("Should create an empty order", async function () {
  const uuid = crypto.randomUUID();
  const taxNumber = "407.302.170-27";
  const order = new Order(uuid, taxNumber);
  expect(order.getTotal()).toBe(0);
});
