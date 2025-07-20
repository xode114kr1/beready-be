const Menu = require("../models/Menu");
const Review = require("../models/Review");

async function updateRating(menuId) {
  const reviews = await Review.find({ menuId });

  const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);

  const average = reviews.length === 0 ? 0 : total / reviews.length;
  console.log(reviews);
  await Menu.findByIdAndUpdate(menuId, {
    rating: average,
  });
}

module.exports = { updateRating };
