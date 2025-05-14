const Menu = require("../models/Menu");

const menuController = {};

menuController.createMenu = async (req, res) => {
  try {
    const { name, cornerNum, description, price } = req.body;
    const newMenu = new Menu({
      name,
      cornerNum,
      description,
      price,
    });
    if (!newMenu) throw new Error("fail create menu");
    await newMenu.save();
    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = menuController;
