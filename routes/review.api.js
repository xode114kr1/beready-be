const express = require("express");
const authController = require("../controllers/auth.controller");
const reviewController = require("../controllers/review.controller");
const router = express.Router();

router.post("/", authController.authenticate, reviewController.createReview);

module.exports = router;
