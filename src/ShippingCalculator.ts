export default class ShippingCalculator {
  static calculate(product: any) {
    const volume =
      ((((product.width / 100) * product.height) / 100) * product.length) / 100;
    const density = parseFloat(product.weight) / volume;
    const itemShipping = 1000 * volume * (density / 100);
    return itemShipping;
  }
}
