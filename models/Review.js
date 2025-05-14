const mongoose = require("mongoose");
const User = require("./User");
const Menu = require("./Menu");
const Schema = mongoose.Schema;

const reviewSchema = Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, required: true },
    userId: { type: mongoose.ObjectId, ref: User, required: true },
    menuId: { type: mongoose.ObjectId, ref: Menu, required: true },
  },
  { timestamps: true }
);

reviewSchema.methods.toJSON = () => {
  const obj = this._doc;
  delete obj.__v;
  return obj;
};

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
