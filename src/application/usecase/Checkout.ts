import CouponRepository from "../../CouponRepository";
import CouponRepositoryDatabase from "../../CouponRepositoryDatabase";
import CurrencyGateway from "../../CurrencyGateway";
import CurrencyGatewayHttp from "../../CurrencyGatewayHttp";
import CurrencyTable from "../../domain/entity/CurrencyTable";
import Order from "../../domain/entity/Order";
import ShippingCalculator from "../../domain/entity/ShippingCalculator";
import OrderRepository from "../../OrderRepository";
import orderRepositoryDatabase from "../../OrderRepositoryDatabase";
import ProductRepository from "../../ProductRepository";
import ProductRepositoryDatabase from "../../ProductRepositoryDatabase";

export default class Checkout {
  constructor(
    readonly currencyGateway: CurrencyGateway = new CurrencyGatewayHttp(),
    readonly productRepository: ProductRepository = new ProductRepositoryDatabase(),
    readonly couponRepository: CouponRepository = new CouponRepositoryDatabase(),
    readonly orderRepository: OrderRepository = new orderRepositoryDatabase()
  ) {}

  async execute(input: Input): Promise<Output> {
    const currencies = await this.currencyGateway.getCurrencies();
    const currencyTable = new CurrencyTable();
    currencyTable.addCurrency("USD", currencies.usd);
    const sequence = await this.orderRepository.count();
    const order = new Order(
      input.uuid,
      input.taxNumber,
      currencyTable,
      sequence,
      new Date()
    );
    let shipping = 0;
    if (input.items) {
      for (const item of input.items) {
        const product = await this.productRepository.getProduct(item.idProduct);
        order.addItem(product, item.quantity);
        const itemShipping = ShippingCalculator.calculate(product);
        shipping += Math.max(itemShipping, 10) * item.quantity;
      }
    }
    if (input.from && input.to) {
      order.shipping = shipping;
    }
    if (input.coupon) {
      const coupon = await this.couponRepository.getCoupon(input.coupon);
      order.addCoupon(coupon);
    }
    let total = order.getTotal();
    await this.orderRepository.save(order);
    return { total, shipping };
  }
}

type Input = {
  uuid?: string;
  taxNumber: string;
  items: { idProduct: number; quantity: number; price?: number }[];
  coupon?: string;
  from?: string;
  to?: string;
};

type Output = {
  total: number;
  shipping: number;
};
