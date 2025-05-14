const User = require("../models/User");

const userController = {};

userController.createUser = async (req, res) => {
  try {
    const { email, password, name, level } = req.body;
    const user = await User.findOne({ email });
    if (user) throw new Error("User already exist");

    const newUser = new User({
      email,
      password,
      name,
      level: level ? level : "user",
    });
    console.log(newUser);
    await newUser.save();
    return res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = userController;
