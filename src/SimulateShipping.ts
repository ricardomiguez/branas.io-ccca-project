import ProductRepository from "./ProductRepository";
import ProductRepositoryDatabase from "./ProductRepositoryDatabase";
import ShippingCalculator from "./ShippingCalculator";

export default class SimulateShipping {
  constructor(
    readonly productRepository: ProductRepository = new ProductRepositoryDatabase()
  ) {}

  async execute(input: Input): Promise<Output> {
    const output: Output = { shipping: 0 };
    if (input.items) {
      for (const item of input.items) {
        const product = await this.productRepository.getProduct(item.idProduct);
        const itemShipping = ShippingCalculator.calculate(product);
        output.shipping += Math.max(itemShipping, 10) * item.quantity;
      }
    }
    return output;
  }
}

type Input = {
  items: { idProduct: number; quantity: number }[];
};

type Output = {
  shipping: number;
};
