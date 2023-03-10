drop table ccca.order;
drop table ccca.item;
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
  length integer,
  weight numeric,
  currency text
);

insert into ccca.product (id_product, description, price, width, height, length, weight, currency) values (1, 'A', 1000, 100, 30, 10, 3, 'BRL');
insert into ccca.product (id_product, description, price, width, height, length, weight, currency) values (2, 'B', 5000, 50, 50, 50, 22, 'BRL');
insert into ccca.product (id_product, description, price, width, height, length, weight, currency) values (3, 'C', 30, 10, 10, 10, 0.9, 'BRL');
insert into ccca.product (id_product, description, price, width, height, length, weight, currency) values (4, 'D', 30, -10, 10, 10, 0.9, 'BRL');
insert into ccca.product (id_product, description, price, width, height, length, weight, currency) values (5, 'A', 1000, 100, 30, 10, 3, 'USD');

create table ccca.coupon (
  code text,
  percentage numeric,
  expire_date timestamp
);

insert into ccca.coupon (code, percentage, expire_date) values ('DISCOUNT20', 20, '2023-10-01T10:00:00');
insert into ccca.coupon (code, percentage, expire_date) values ('DISCOUNT10', 10, '2022-10-01T10:00:00');

create table ccca.order (
  id_order text,
  tax_number text,
  code text,
  total numeric,
  shipping numeric
);

create table ccca.item (
  id_order text,
  id_product integer,
  price numeric,
  quantity integer
);
