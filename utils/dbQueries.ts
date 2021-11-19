import db from "./dbConfig";

// fetch all data from the table
export const table = async (): Promise<any[]> => {
  return await db.public.many(`SELECT * FROM PHONE_TABLE`);
};
// insert new data on the table
export const insert = async (value: string): Promise<any> => {
  return await db.public.one(
    `INSERT INTO PHONE_TABLE (NUMBER) VALUES ('${value}');`
  );
};
// delete table data by NUMBER field
export const remove = async (id: number, value: string): Promise<any> => {
  return await db.public.one(
    `DELETE FROM PHONE_TABLE WHERE ID=${id} AND NUMBER='${value}';`
  );
};
// update table data by NUMBER field
export const update = async (id: number, value: string): Promise<any> => {
  return await db.public.one(
    `UPDATE PHONE_TABLE SET NUMBER='${value}' WHERE ID='${id}';`
  );
};
// update table data by NUMBER field
export const isExists = async (
  id: number,
  value?: string
): Promise<boolean> => {
  // currently the library doesnt support built-in sub query like EXISTS or find.
  // just to make it working, simply just get the size of array on query response
  let count = db.public.many(
    `SELECT 1 FROM PHONE_TABLE WHERE ID='${id}' ${
      value === undefined ? "" : `AND NUMBER='${value}'`
    };`
  ).length;
  return (await (count > 0)) ? true : false;
};
