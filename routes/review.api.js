const express = require("express");
const authController = require("../controllers/auth.controller");
const reviewController = require("../controllers/review.controller");
const router = express.Router();

router.get("/", reviewController.getReviewList);
router.post("/", authController.authenticate, reviewController.createReview);
router.post("/:id", authController.authenticate, reviewController.updateReview);
router.delete(
  "/:id",
  authController.authenticate,
  reviewController.deleteReview
);
module.exports = router;
