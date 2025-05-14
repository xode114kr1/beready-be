const express = require("express");
const userApi = require("./user.api");
const authApi = require("./auth.api");
const reviewApi = require("./review.api");
const menuApi = require("./menu.api");

const router = express.Router();

router.use("/user", userApi);
router.use("/auth", authApi);
router.use("/review", reviewApi);
router.use("/menu", menuApi);

module.exports = router;
