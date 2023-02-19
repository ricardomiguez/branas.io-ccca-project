import pgp from "pg-promise";

export default class ProductRepositoryDatabase {
  async getProduct(idProduct: number): Promise<any> {
    const connection = pgp()(
      "postgres://postgres:123456@localhost:5432/ricardomiguez"
    );
    const [productData] = await connection.query(
      "select * from ccca.product where id_product = $1",
      [idProduct]
    );
    await connection.$pool.end();
    return productData;
  }
}
