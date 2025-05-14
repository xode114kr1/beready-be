const Jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    level: { type: String, default: "user" },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.password;
  delete obj.__v;
  delete obj.updatedAt;
  delete obj.createdAt;
  return obj;
};

userSchema.methods.generateToken = async () => {
  const token = Jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "id",
  });
  return token;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
