import crypto from "crypto";
import sinon from "sinon";
import Checkout from "../src/application/usecase/Checkout";
import GetOrder from "../src/application/usecase/GetOrder";
import CouponRepositoryDatabase from "../src/CouponRepositoryDatabase";
import CurrencyGateway from "../src/CurrencyGateway";
import CurrencyGatewayHttp from "../src/CurrencyGatewayHttp";
import Product from "../src/domain/entity/Product";
import orderRepositoryDatabase from "../src/OrderRepositoryDatabase";
import ProductRepository from "../src/ProductRepository";
import ProductRepositoryDatabase from "../src/ProductRepositoryDatabase";

let checkout: Checkout;
let getOrder: GetOrder;

beforeEach(function () {
  checkout = new Checkout();
  getOrder = new GetOrder();
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
  const uuid = crypto.randomUUID();
  const input = {
    uuid,
    taxNumber: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
    ],
  };
  await checkout.execute(input);
  const output = await getOrder.execute(uuid);
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

test("Should create an order with 1 product in dollar currency (using a stub)", async function () {
  const stubCurrencyGateway = sinon
    .stub(CurrencyGatewayHttp.prototype, "getCurrencies")
    .resolves({ usd: 3 });
  const stubProductRepository = sinon
    .stub(ProductRepositoryDatabase.prototype, "getProduct")
    .resolves(new Product(5, "A", 1000, 100, 30, 10, 3, "USD"));
  const input = {
    taxNumber: "407.302.170-27",
    items: [{ idProduct: 5, quantity: 1 }],
  };
  const output = await checkout.execute(input);
  expect(output.total).toBe(3000);
  stubCurrencyGateway.restore();
  stubProductRepository.restore();
});

test("Should create an order with 3 products applying a discount coupon (using a spy)", async function () {
  const spyProductRepository = sinon.spy(
    ProductRepositoryDatabase.prototype,
    "getProduct"
  );
  const spyCouponRepository = sinon.spy(
    CouponRepositoryDatabase.prototype,
    "getCoupon"
  );
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
  expect(spyProductRepository.calledThrice).toBeTruthy();
  expect(spyCouponRepository.calledOnce).toBeTruthy();
  expect(spyCouponRepository.calledWith("DISCOUNT20")).toBeTruthy();
  spyProductRepository.restore();
  spyCouponRepository.restore();
});

test("Should create an order with 1 product in dollar currency (using a mock)", async function () {
  const mockCurrencyGateway = sinon.mock(CurrencyGatewayHttp.prototype);
  mockCurrencyGateway.expects("getCurrencies").once().resolves({ usd: 3 });
  const input = {
    taxNumber: "407.302.170-27",
    items: [{ idProduct: 5, quantity: 1 }],
  };
  const output = await checkout.execute(input);
  expect(output.total).toBe(3000);
  mockCurrencyGateway.verify();
  mockCurrencyGateway.restore();
});

test("Should create an order with 1 product in dollar currency (using a fake)", async function () {
  const currencyGateway: CurrencyGateway = {
    async getCurrencies(): Promise<any> {
      return {
        usd: 3,
      };
    },
  };
  const productRepository: ProductRepository = {
    async getProduct(): Promise<any> {
      return new Product(6, "A", 1000, 100, 30, 10, 3, "USD");
    },
  };
  checkout = new Checkout(currencyGateway, productRepository);
  const input = {
    taxNumber: "407.302.170-27",
    items: [{ idProduct: 6, quantity: 1 }],
  };
  const output = await checkout.execute(input);
  expect(output.total).toBe(3000);
});

test("Should create an order and verify the order code", async function () {
  const stub = sinon
    .stub(orderRepositoryDatabase.prototype, "count")
    .resolves(1);
  const uuid = crypto.randomUUID();
  const input = {
    uuid,
    taxNumber: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
    ],
  };
  await checkout.execute(input);
  const output = await getOrder.execute(uuid);
  expect(output.code).toBe("202300000001");
  stub.restore();
});
