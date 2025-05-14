const Review = require("../models/Review");

const reviewController = {};

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
    console.log(newReview);
    await newReview.save();

    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = reviewController;
