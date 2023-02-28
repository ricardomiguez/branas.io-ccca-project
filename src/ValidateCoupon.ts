import CouponRepository from "./CouponRepository";
import CouponRepositoryDatabase from "./CouponRepositoryDatabase";

export default class ValidateCoupon {
  constructor(
    readonly couponRepository: CouponRepository = new CouponRepositoryDatabase()
  ) {}

  async execute(code: string): Promise<boolean> {
    const couponData = await this.couponRepository.getCoupon(code);
    return couponData.expire_date.getTime() >= new Date().getTime();
  }
}
