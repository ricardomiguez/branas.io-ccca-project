import axios from "axios";

test("Should not accept an invalid tax number", async function () {
  const input = { taxNumber: "406.302.170-27" };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(output.message).toBe("Invalid tax number");
});

test("Should create an empty order", async function () {
  const input = { taxNumber: "407.302.170-27" };
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
