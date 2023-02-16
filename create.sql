drop table ccca.coupon;
drop table ccca.product;
drop schema ccca;
create schema ccca;

create table ccca.product (
  id_product integer,
  description text,
  price numeric,
  width integer,
  height integer,
  lenght integer,
  weight numeric
);

insert into ccca.product (id_product, description, price, width, height, lenght, weight) values (1, 'A', 1000, 100, 30, 10, 3);
insert into ccca.product (id_product, description, price, width, height, lenght, weight) values (2, 'B', 5000, 50, 50, 50, 22);
insert into ccca.product (id_product, description, price, width, height, lenght, weight) values (3, 'C', 30, 10, 10, 10, 0.9);
insert into ccca.product (id_product, description, price, width, height, lenght, weight) values (4, 'D', 30, -10, 10, 10, 0.9);

create table ccca.coupon (
  code text,
  percentage numeric,
  expire_date timestamp
);

insert into ccca.coupon (code, percentage, expire_date) values ('DISCOUNT20', 20, '2023-10-01T10:00:00');
insert into ccca.coupon (code, percentage, expire_date) values ('DISCOUNT10', 10, '2022-10-01T10:00:00');
