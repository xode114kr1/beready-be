const { default: mongoose } = require("mongoose");
const Review = require("../models/Review");
const { updateRating } = require("../utils/ratingUtils");

const reviewController = {};

reviewController.getTopReviewById = async (req, res) => {
  try {
    const menuId = req.params.id;
    const reviewList = await Review.find({ menuId })
      .sort({ rating: -1, createdAt: -1 }) // createAt → createdAt
      .limit(3)
      .populate({ path: "userId" }) // populate 문법 수정
      .lean();
    res.status(200).json({ status: "success", data: reviewList });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

reviewController.getReviewList = async (req, res) => {
  try {
    const reviewList = await Review.find({})
      .populate("menuId")
      .populate("userId")
      .lean();
    res.status(200).json({ status: "success", data: reviewList });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

reviewController.getReviewById = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId).populate("menuId").lean();
    res.status(200).json({ status: "success", data: review });
  } catch (error) {
    res.status(400).json({ statue: "fail", error: error.message });
  }
};

reviewController.getReviewRandom = async (req, res) => {
  try {
    const reviewCount = await Review.countDocuments();
    const randomIndex = Math.floor(Math.random() * reviewCount);
    const review = await Review.findOne()
      .skip(randomIndex)
      .populate("menuId")
      .populate("userId")
      .lean();
    res.status(200).json({ status: "success", data: review });
  } catch (error) {
    res.status(400).json({ statue: "fail", error: error.message });
  }
};

reviewController.createReview = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, content, rating, menuId } = req.body;
    const newReview = new Review({
      title,
      content,
      rating,
      userId,
      menuId,
    });

    if (!newReview) throw new Error("fail create review");
    await newReview.save();

    await updateRating(menuId);

    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

reviewController.updateReview = async (req, res) => {
  try {
    const userId = req.userId;
    const reviewId = req.params.id;

    const { title, content, rating } = req.body;

    let review = await Review.findOne({ _id: reviewId });
    if (!review) throw new Error("fail find Review");
    if (!review.userId.equals(userId)) throw new Error("권한이 없습니다");
    review.title = title;
    review.content = content;
    review.rating = rating;

    await review.save();

    const menuId = review.menuId.toString();

    await updateRating(menuId);

    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

reviewController.deleteReview = async (req, res) => {
  try {
    const userId = req.userId;
    const reviewId = req.params.id;
    let review = await Review.findOne({ _id: reviewId });
    const deletedReview = await Review.findOneAndDelete({
      _id: reviewId,
      userId: userId,
    });

    if (!deletedReview) {
      throw new Error("Review not found or unauthorized");
    }

    const menuId = review.menuId.toString();
    await updateRating(menuId);
    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = reviewController;
