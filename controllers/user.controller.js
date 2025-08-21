const bcrypt = require("bcryptjs");
const User = require("../models/User");

const userController = {};

userController.createUser = async (req, res) => {
  try {
    const { email, password, name, level } = req.body;
    const user = await User.findOne({ email });
    if (user) throw new Error("User already exist");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      level: level ? level : "user",
    });
    await newUser.save();

    const userSafe = newUser.toObject();
    delete userSafe.password;

    return res.status(200).json({ status: "success", data: userSafe });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

userController.updateName = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.userId;
    console.log(name, userId);
    const user = await User.findOne({ _id: userId });
    user.name = name;
    await user.save();
    return res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = userController;
