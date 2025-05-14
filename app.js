const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const indexRouter = require("./routes/index");

const app = express();
require("dotenv").config();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api", indexRouter);

const mongoURL = process.env.LOCAL_DB_ADDRESS;
mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongoose connected"))
  .catch((e) => console.log("DB connection fail", e));

app.listen(process.env.PORT || 5000, () => {
  console.log("server on");
});
