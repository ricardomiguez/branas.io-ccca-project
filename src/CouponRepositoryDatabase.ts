import pgp from "pg-promise";
import CouponRepository from "./CouponRepository";
import Coupon from "./domain/entity/Coupon";

export default class CouponRepositoryDatabase implements CouponRepository {
  async getCoupon(code: string): Promise<Coupon> {
    const connection = pgp()(
      "postgres://postgres:123456@localhost:5432/ricardomiguez"
    );
    const [couponData] = await connection.query(
      "select * from ccca.coupon where code = $1",
      [code]
    );
    await connection.$pool.end();
    return new Coupon(
      couponData.code,
      parseFloat(couponData.percentage),
      couponData.expire_date
    );
  }
}
