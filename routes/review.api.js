const express = require("express");
const authController = require("../controllers/auth.controller");
const reviewController = require("../controllers/review.controller");
const router = express.Router();

router.get("/", reviewController.getReviewList);
router.get("/top/:id", reviewController.getTopReviewById);
router.get("/random", reviewController.getReviewRandom);
router.get("/:id", reviewController.getReviewById);
router.post("/", authController.authenticate, reviewController.createReview);
router.post("/:id", authController.authenticate, reviewController.updateReview);
router.delete(
  "/:id",
  authController.authenticate,
  reviewController.deleteReview
);

module.exports = router;
