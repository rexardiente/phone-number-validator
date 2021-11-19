import express from "express";
import path from "path";

import indexRouter from "./routes/index";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// bind and listen to the specified host and port
app.listen(3000, () => {
  console.log("The application is listening on port 3000!");
});
