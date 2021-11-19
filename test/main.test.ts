import express from "express";
import request from "supertest";
import router from "../routes";
import { table } from "../utils/dbQueries";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

test("db table `PHONE_TABLE` default size must be equal to 5", async () => {
  await table().then((res) => expect(res.length).toEqual(5));
});

test("response to /phone-numbers must return status code 200 and header type application/json", async () => {
  await request(app)
    .get("/phone-numbers")
    .expect(200)
    .then((res) =>
      expect(res.headers["content-type"]).toBe("application/json")
    );
});

test("+639XXXXXXXXX => header 200, is_error: false and formatted phone_number", async () => {
  const data = {
    phone: "+639999999996",
    language: "PH",
  };
  await request(app)
    .post("/phone-number")
    .send(data)
    .expect(200)
    .then((res) => {
      expect(res.body.is_error).toBe(false);
      expect(res.body.phone_number).toBe("09999999996");
    });
});

test("09981234567 => header 200, is_error: false and formatted phone_number", async () => {
  const data = {
    phone: "09981234567",
    language: "PH",
  };
  await request(app)
    .post("/phone-number")
    .send(data)
    .expect(200)
    .then((res) => {
      expect(res.body.is_error).toBe(false);
      expect(res.body.phone_number).toBe(data.phone);
    });
});

test("639981234568 => header 200, is_error: false and formatted phone_number", async () => {
  const data = {
    phone: "639981234568",
    language: "PH",
  };
  await request(app)
    .post("/phone-number")
    .send(data)
    .expect(200)
    .then((res) => {
      expect(res.body.is_error).toBe(false);
      expect(res.body.phone_number).toBe("09981234568");
    });
});

test("0639981234567 => header 422, is_error: true and return phone_number", async () => {
  const data = {
    phone: "0639981234567",
    language: "PH",
  };
  await request(app)
    .post("/phone-number")
    .send(data)
    .expect(422)
    .then((res) => {
      expect(res.body.is_error).toBe(true);
      expect(res.body.phone_number).toBe(data.phone);
    });
});

test("1234567 => header 422, is_error: true and return phone_number", async () => {
  const data = {
    phone: "1234567",
    language: "PH",
  };
  await request(app)
    .post("/phone-number")
    .send(data)
    .expect(422)
    .then((res) => {
      expect(res.body.is_error).toBe(true);
      expect(res.body.phone_number).toBe(data.phone);
    });
});
