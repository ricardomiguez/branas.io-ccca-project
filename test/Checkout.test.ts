import sinon from "sinon";
import Checkout from "../src/Checkout";
import CurrencyGatewayHttp from "../src/CurrencyGatewayHttp";
import ProductRepositoryDatabase from "../src/ProductRepositoryDatabase";

let checkout: Checkout;

beforeEach(function () {
  checkout = new Checkout();
});

test("Should not accept an invalid tax number", async function () {
  const input = { taxNumber: "406.302.170-27", items: [] };
  expect(() => checkout.execute(input)).rejects.toThrow(
    new Error("Invalid tax number")
  );
});

test("Should create an empty order", async function () {
  const input = { taxNumber: "407.302.170-27", items: [] };
  const output = await checkout.execute(input);
  expect(output.total).toBe(0);
});

test("Should create an order with 3 products", async function () {
  const input = {
    taxNumber: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
    ],
  };
  const output = await checkout.execute(input);
  expect(output.total).toBe(6090);
});

test("Should create an order with 3 products applying a discount coupon", async function () {
  const input = {
    taxNumber: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
    ],
    coupon: "DISCOUNT20",
  };
  const output = await checkout.execute(input);
  expect(output.total).toBe(4872);
});

test("Should create an order with 3 products applying an expired discount coupon", async function () {
  const input = {
    taxNumber: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
    ],
    coupon: "DISCOUNT10",
  };
  const output = await checkout.execute(input);
  expect(output.total).toBe(6090);
});

test("Should not create an order with negative quantity", async function () {
  const input = {
    taxNumber: "407.302.170-27",
    items: [{ idProduct: 1, quantity: -1 }],
  };
  expect(() => checkout.execute(input)).rejects.toThrow(
    new Error("Invalid quantity")
  );
});

test("Should not create an order with duplicated item", async function () {
  const input = {
    taxNumber: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 1, quantity: 1 },
    ],
  };
  expect(() => checkout.execute(input)).rejects.toThrow(
    new Error("Duplicated item")
  );
});

test("Should create an order with 1 product calculating the shipping", async function () {
  const input = {
    taxNumber: "407.302.170-27",
    items: [{ idProduct: 1, quantity: 3 }],
    from: "22060030",
    to: "88015600",
  };
  const output = await checkout.execute(input);
  expect(output.shipping).toBe(90);
  expect(output.total).toBe(3090);
});

test("Should not create an order if the product has negative dimensions", async function () {
  const input = {
    taxNumber: "407.302.170-27",
    items: [{ idProduct: 4, quantity: 1 }],
  };
  expect(() => checkout.execute(input)).rejects.toThrow(
    new Error("Invalid dimension")
  );
});

test("Should create an order with 1 product calculating the shipping with a minimum value", async function () {
  const input = {
    taxNumber: "407.302.170-27",
    items: [{ idProduct: 3, quantity: 1 }],
    from: "22060030",
    to: "88015600",
  };
  const output = await checkout.execute(input);
  expect(output.shipping).toBe(10);
  expect(output.total).toBe(40);
});

test("Should create an order with 1 product in dollar currency", async function () {
  const stubCurrencyGateway = sinon
    .stub(CurrencyGatewayHttp.prototype, "getCurrencies")
    .resolves({ usd: 3 });
  const stubProductRepository = sinon
    .stub(ProductRepositoryDatabase.prototype, "getProduct")
    .resolves({
      idProduct: 5,
      description: "A",
      price: 1000,
      width: 100,
      height: 30,
      lenght: 10,
      weight: 3,
      currency: "USD",
    });
  const input = {
    taxNumber: "407.302.170-27",
    items: [{ idProduct: 5, quantity: 1 }],
  };
  const output = await checkout.execute(input);
  expect(output.total).toBe(3000);
  stubCurrencyGateway.restore();
  stubProductRepository.restore();
});
