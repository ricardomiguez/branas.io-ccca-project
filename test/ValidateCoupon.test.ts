import ValidateCoupon from "../src/ValidateCoupon";

let validateCoupon: ValidateCoupon;

beforeEach(function () {
  validateCoupon = new ValidateCoupon();
});

test("Should validate a valid discount coupon", async function () {
  const input = "DISCOUNT20";
  const output = await validateCoupon.execute(input);
  expect(output).toBeTruthy();
});

test("Should validate a invalid discount coupon", async function () {
  const input = "DISCOUNT10";
  const output = await validateCoupon.execute(input);
  expect(output).toBeFalsy();
});
