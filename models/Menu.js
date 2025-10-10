const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const menuSchema = Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  status: { type: String, default: "상시" },
  imageKey: { type: String, default: "menu/undefined.jpg" },
});

menuSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

const Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;
