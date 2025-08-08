const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const indexRouter = require("./routes/index");

const app = express();
require("dotenv").config();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api", indexRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const mongoURL = process.env.LOCAL_DB_ADDRESS;
const HOST = process.env.HOST;
mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongoose connected"))
  .catch((e) => console.log("DB connection fail", e));

app.listen(process.env.PORT, HOST, () => {
  console.log("server on");
});
