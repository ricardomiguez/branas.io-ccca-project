import ProductRepository from "./ProductRepository";
import ProductRepositoryDatabase from "./ProductRepositoryDatabase";

export default class SimulateShipping {
  constructor(
    readonly productRepository: ProductRepository = new ProductRepositoryDatabase()
  ) {}

  async execute(input: Input): Promise<Output> {
    const output: Output = { shipping: 0 };
    if (input.items) {
      for (const item of input.items) {
        const productData = await this.productRepository.getProduct(
          item.idProduct
        );
        const volume =
          ((((productData.width / 100) * productData.height) / 100) *
            productData.length) /
          100;
        const density = parseFloat(productData.weight) / volume;
        const itemShipping = 1000 * volume * (density / 100);
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
