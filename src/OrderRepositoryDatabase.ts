import pgp from "pg-promise";
import Item from "./Item";
import Order from "./Order";
import OrderRepository from "./OrderRepository";

export default class orderRepositoryDatabase implements OrderRepository {
  async save(order: Order): Promise<void> {
    const connection = pgp()(
      "postgres://postgres:123456@localhost:5432/ricardomiguez"
    );
    await connection.query(
      "insert into ccca.order (id_order, tax_number, code, total, shipping) values ($1, $2, $3, $4, $5)",
      [
        order.idOrder,
        order.taxNumber,
        order.code,
        order.getTotal(),
        order.shipping,
      ]
    );
    for (const item of order.items) {
      await connection.query(
        "insert into ccca.item (id_order, id_product, price, quantity) values ($1, $2, $3, $4)",
        [order.idOrder, item.idProduct, item.price, item.quantity]
      );
    }
    await connection.$pool.end();
  }

  async getById(id: string): Promise<Order> {
    const connection = pgp()(
      "postgres://postgres:123456@localhost:5432/ricardomiguez"
    );
    const [orderData] = await connection.query(
      "select * from ccca.order where id_order = $1",
      [id]
    );
    const order = new Order(
      orderData.id_order,
      orderData.tax_number,
      undefined,
      1,
      new Date()
    );
    const itemsData = await connection.query(
      "select * from ccca.item where id_order = $1",
      [id]
    );
    for (const itemData of itemsData) {
      order.items.push(
        new Item(
          itemData.id_product,
          parseFloat(itemData.price),
          itemData.quantity,
          "BRL"
        )
      );
    }
    await connection.$pool.end();
    return order;
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
