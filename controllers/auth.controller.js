const User = require("../models/User");

const authController = {};

authController.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) throw new Error("invalid email or password");
    const token = await user.generateToken();
    return res.status(200).json({ status: "success", user, token });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = authController;
