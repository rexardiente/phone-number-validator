import express from "express";
import {
  fetch_phone_numbers,
  insert_phone_num,
  update_phone_num,
  delete_phone_num,
} from "../controllers/homeController";

let router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express Update" });
});
// Phone Numbers API
router.get("/phone-numbers", fetch_phone_numbers);
router.post("/phone-number", insert_phone_num);
router.put("/phone-number/:id", update_phone_num);
router.delete("/phone-number/:id", delete_phone_num);

export default router;
