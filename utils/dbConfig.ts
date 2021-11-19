import { newDb } from "pg-mem";

// initialize memory DB
const db = newDb();
// create new DB table, AUTO_INC id and set NUMBER type as VARCHAR with ff. contraints UNIQUE and NOT NULL.
db.public.none(
  `create table PHONE_TABLE(ID serial PRIMARY KEY, NUMBER VARCHAR UNIQUE NOT NULL);`
);
// insert sample values into the table
db.public.none(`INSERT INTO PHONE_TABLE (NUMBER) VALUES ('09999999991');`);
db.public.none(`INSERT INTO PHONE_TABLE (NUMBER) VALUES ('09999999992');`);
db.public.none(`INSERT INTO PHONE_TABLE (NUMBER) VALUES ('09999999993');`);
db.public.none(`INSERT INTO PHONE_TABLE (NUMBER) VALUES ('09999999994');`);
db.public.none(`INSERT INTO PHONE_TABLE (NUMBER) VALUES ('09999999995');`);

export default db;
