const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const menuSchema = Schema({
  name: { type: String, required: true },
  cornerNum: { type: Number, required: true },
  description: { type: String },
  price: { type: Number, required: true },
});

menuSchema.methods.toJSON = () => {
  const obj = this.obj;
  delete obj.__v;
  return obj;
};

const Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;
