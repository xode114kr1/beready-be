const Menu = require("../models/Menu");

const menuController = {};

menuController.getMenuList = async (req, res) => {
  try {
    const { category } = req.query;

    let menuList;
    if (category) {
      menuList = await Menu.find({ category });
    } else {
      menuList = await Menu.find();
    }

    res.status(200).json({ status: "success", menuList });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

menuController.getMenuById = async (req, res) => {
  try {
    const menuId = req.params.id;
    const menu = await Menu.findById(menuId);
    if (!menu) throw new Error("fail find menu");
    res.status(200).json({ status: "success", data: menu });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

menuController.getMenuRandom = async (req, res) => {
  try {
    const count = await Menu.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const randomMenu = await Menu.findOne().skip(randomIndex);
    res.status(200).json({ status: "success", data: randomMenu });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

menuController.createMenu = async (req, res) => {
  try {
    const { name, category, description, price } = req.body;
    const newMenu = new Menu({
      name,
      category,
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

menuController.deleteMenuListById = async (req, res) => {
  try {
    const { ids } = req.body;

    const result = await Menu.deleteMany({ _id: { $in: ids } });
    return res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

menuController.updateMenu = async (req, res) => {
  try {
    const menuId = req.params.id;
    const { name, category, description, price, status } = req.body;

    const menu = await Menu.findById(menuId);
    if (!menu) throw new Error("fail find Menu");

    menu.name = name;
    menu.category = category;
    menu.description = description;
    menu.price = price;
    menu.status = status;
    await menu.save();

    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = menuController;
