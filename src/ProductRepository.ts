import Product from "./Product";

export default interface ProductRepository {
  getProduct(idProduct: number): Promise<Product>;
}
