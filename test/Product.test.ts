import Product from "../src/domain/entity/Product";

test("Should not create a product with invalid dimensions", function () {
  expect(() => new Product(1, "A", 1000, -10, -10, -10, -10, "BRL")).toThrow(
    new Error("Invalid dimension")
  );
});
