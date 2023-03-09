import Coupon from "./Coupon";

export default interface CouponRepository {
  getCoupon(code: string): Promise<Coupon>;
}
