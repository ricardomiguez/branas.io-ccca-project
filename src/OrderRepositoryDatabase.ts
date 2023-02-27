import pgp from "pg-promise";
import OrderRepository from "./OrderRepository";

export default class orderRepositoryDatabase implements OrderRepository {
  async save(order: any): Promise<void> {
    const connection = pgp()(
      "postgres://postgres:123456@localhost:5432/ricardomiguez"
    );
    await connection.query(
      "insert into ccca.order (id_order, tax_number, code, total, shipping) values ($1, $2, $3, $4, $5)",
      [order.idOrder, order.taxNumber, order.code, order.total, order.shipping]
    );
    for (const item of order.items) {
      await connection.query(
        "insert into ccca.item (id_order, id_product, price, quantity) values ($1, $2, $3, $4)",
        [item.idOrder, item.idProduct, item.price, item.quantity]
      );
    }
    await connection.$pool.end();
  }

  async getById(id: string): Promise<any> {
    const connection = pgp()(
      "postgres://postgres:123456@localhost:5432/ricardomiguez"
    );
    const [orderData] = await connection.query(
      "select * from ccca.order where id_order = $1",
      [id]
    );
    await connection.$pool.end();
    return orderData;
  }

  async count(): Promise<number> {
    const connection = pgp()(
      "postgres://postgres:123456@localhost:5432/ricardomiguez"
    );
    const [options] = await connection.query(
      "select count(*) from ccca.order",
      []
    );
    await connection.$pool.end();
    return parseInt(options.count);
  }
}
