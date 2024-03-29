import crypto from "crypto";
import CurrencyTable from "../src/domain/entity/CurrencyTable";
import Order from "../src/domain/entity/Order";
import Product from "../src/domain/entity/Product";

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

test("Should not add an item with quantity equal to or less than 0", async function () {
  const uuid = crypto.randomUUID();
  const taxNumber = "407.302.170-27";
  const order = new Order(uuid, taxNumber);
  expect(() =>
    order.addItem(new Product(1, "A", 1000, 100, 30, 10, 3, "BRL"), -1)
  ).toThrow(new Error("Invalid quantity"));
});

test("Should create an order with 3 products, one of them in dollar currency", async function () {
  const uuid = crypto.randomUUID();
  const taxNumber = "407.302.170-27";
  const currencyTable = new CurrencyTable();
  currencyTable.addCurrency("USD", 3);
  const order = new Order(uuid, taxNumber, currencyTable);
  order.addItem(new Product(1, "A", 1000, 100, 30, 10, 3, "BRL"), 1);
  order.addItem(new Product(2, "B", 5000, 50, 50, 50, 22, "USD"), 1);
  order.addItem(new Product(3, "C", 30, 10, 10, 10, 0.9, "BRL"), 3);
  expect(order.getTotal()).toBe(16090);
});

test("Should create an order and generate its code", async function () {
  const uuid = crypto.randomUUID();
  const taxNumber = "407.302.170-27";
  const order = new Order(
    uuid,
    taxNumber,
    new CurrencyTable(),
    1,
    new Date("2023-10-01T10:00:00")
  );
  expect(order.getCode()).toBe("202300000001");
});
