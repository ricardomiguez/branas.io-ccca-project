import Coupon from "../src/Coupon";

test("Should create a valid discount coupon", function () {
  const input = new Coupon("DISCOUNT20", 20, new Date("2023-10-01T10:00:00"));
  expect(input.isExpired(new Date("2023-10-01T10:00:00"))).toBeFalsy();
});

test("Should create an invalid discount coupon", function () {
  const input = new Coupon("DISCOUNT20", 20, new Date("2023-10-01T10:00:00"));
  expect(input.isExpired(new Date("2023-12-01T10:00:00"))).toBeTruthy();
});
