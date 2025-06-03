const Review = require("../models/Review");

const reviewController = {};

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
    res.status(200).json({ status: "success", data: review });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

reviewController.deleteReview = async (req, res) => {
  try {
    const userId = req.userId;
    const reviewId = req.params.id;

    const deletedReview = await Review.findOneAndDelete({
      _id: reviewId,
      userId: userId,
    });

    if (!deletedReview) {
      throw new Error("Review not found or unauthorized");
    }

    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = reviewController;
