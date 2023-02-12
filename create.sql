drop table ccca.coupon;
drop table ccca.product;
drop schema ccca;
create schema ccca;

create table ccca.product (
  id_product integer,
  description text,
  price numeric
);

insert into ccca.product (id_product, description, price) values (1, 'A', 1000);
insert into ccca.product (id_product, description, price) values (2, 'B', 5000);
insert into ccca.product (id_product, description, price) values (3, 'C', 30);

create table ccca.coupon (
  code text,
  percentage numeric
);

insert into ccca.coupon (code, percentage) values ('DISCOUNT20', 20);
