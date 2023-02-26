import axios from "axios";

axios.defaults.validateStatus = function () {
  return true;
};

test("Should not accept an invalid tax number", async function () {
  const input = { taxNumber: "406.302.170-27", items: [] };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(response.status).toBe(422);
  expect(output.message).toBe("Invalid tax number");
});

test("Should create an empty order", async function () {
  const input = { taxNumber: "407.302.170-27", items: [] };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
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
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
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
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
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
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(output.total).toBe(6090);
});

test("Should not create an order with negative quantity", async function () {
  const input = {
    taxNumber: "407.302.170-27",
    items: [{ idProduct: 1, quantity: -1 }],
  };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(response.status).toBe(422);
  expect(output.message).toBe("Invalid quantity");
});

test("Should not create an order with duplicated item", async function () {
  const input = {
    taxNumber: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 1, quantity: 1 },
    ],
  };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(response.status).toBe(422);
  expect(output.message).toBe("Duplicated item");
});

test("Should create an order with 1 product calculating the shipping", async function () {
  const input = {
    taxNumber: "407.302.170-27",
    items: [{ idProduct: 1, quantity: 3 }],
    from: "22060030",
    to: "88015600",
  };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(output.shipping).toBe(90);
  expect(output.total).toBe(3090);
});

test("Should not create an order if the product has negative dimensions", async function () {
  const input = {
    taxNumber: "407.302.170-27",
    items: [{ idProduct: 4, quantity: 1 }],
  };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(response.status).toBe(422);
  expect(output.message).toBe("Invalid dimension");
});

test("Should create an order with 1 product calculating the shipping with a minimum value", async function () {
  const input = {
    taxNumber: "407.302.170-27",
    items: [{ idProduct: 3, quantity: 1 }],
    from: "22060030",
    to: "88015600",
  };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(output.shipping).toBe(10);
  expect(output.total).toBe(40);
});
