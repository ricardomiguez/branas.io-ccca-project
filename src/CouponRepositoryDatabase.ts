import pgp from "pg-promise";
import CouponRepository from "./CouponRepository";

export default class CouponRepositoryDatabase implements CouponRepository {
  async getCoupon(code: string): Promise<any> {
    const connection = pgp()(
      "postgres://postgres:123456@localhost:5432/ricardomiguez"
    );
    const [couponData] = await connection.query(
      "select * from ccca.coupon where code = $1",
      [code]
    );
    await connection.$pool.end();
    return couponData;
  }
}
