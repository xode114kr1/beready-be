const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const menuSchema = Schema({
  name: { type: String, required: true },
  image: {
    type: String,
    default:
      "https://previews.123rf.com/images/azvector/azvector1803/azvector180300154/97280887-%EC%B7%A8%EC%86%8C-%EA%B8%B0%ED%98%B8-%EC%B9%B4%EB%A9%94%EB%9D%BC-%EC%95%84%EC%9D%B4%EC%BD%98%EC%9E%85%EB%8B%88%EB%8B%A4.jpg",
  },
  cornerNum: { type: Number, required: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
});

menuSchema.methods.toJSON = () => {
  const obj = this.obj;
  delete obj.__v;
  return obj;
};

const Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;
