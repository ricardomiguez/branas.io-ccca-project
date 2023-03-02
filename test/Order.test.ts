test("Should create an empty order", async function () {
  const order = new Order(uuid, taxNumber);
  expect(order.getTotal()).toBe(0);
});
