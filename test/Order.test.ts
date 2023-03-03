import crypto from "crypto";
import Order from "../src/Order";
import Product from "../src/Product";

test("Should not create an order with an invalid tax number", async function () {
  const uuid = crypto.randomUUID();
  const taxNumber = "406.302.170-27";
  expect(() => new Order(uuid, taxNumber)).toThrow(
    new Error("Invalid tax number")
  );
});

test("Should create an empty order", async function () {
  const uuid = crypto.randomUUID();
  const taxNumber = "407.302.170-27";
  const order = new Order(uuid, taxNumber);
  expect(order.getTotal()).toBe(0);
});

test("Should create an order with 3 products", async function () {
  const uuid = crypto.randomUUID();
  const taxNumber = "407.302.170-27";
  const order = new Order(uuid, taxNumber);
  order.addItem(new Product(1, "A", 1000, 100, 30, 10, 3, "BRL"), 1);
  order.addItem(new Product(2, "B", 5000, 50, 50, 50, 22, "BRL"), 1);
  order.addItem(new Product(3, "C", 30, 10, 10, 10, 0.9, "BRL"), 3);
  expect(order.getTotal()).toBe(6090);
});

test("Should not add duplicate items", async function () {
  const uuid = crypto.randomUUID();
  const taxNumber = "407.302.170-27";
  const order = new Order(uuid, taxNumber);
  order.addItem(new Product(1, "A", 1000, 100, 30, 10, 3, "BRL"), 1);
  expect(() =>
    order.addItem(new Product(1, "A", 1000, 100, 30, 10, 3, "BRL"), 1)
  ).toThrow(new Error("Duplicated item"));
});
