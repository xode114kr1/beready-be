const Menu = require("../models/Menu");
const path = require("path");
const fs = require("fs");

const menuController = {};

const deleteFileIfExists = (url) => {
  if (!url) return;
  const filename = url.split("/uploads/")[1];
  if (!filename) return;
  const filePath = path.join(__dirname, "..", "uploads", filename);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`기존 이미지 삭제: ${filename}`);
    } catch (err) {
      console.error("이미지 삭제 실패:", err);
    }
  }
};

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
    const {
      name,
      category,
      description = "",
      price,
      status = "상시",
    } = req.body;

    if (!name || !category || price === undefined) {
      return res
        .status(400)
        .json({ status: "fail", error: "name, category, price는 필수입니다." });
    }

    const priceNum = Number(price);
    if (Number.isNaN(priceNum)) {
      return res
        .status(400)
        .json({ status: "fail", error: "price는 숫자여야 합니다." });
    }

    const imageUrl = req.file
      ? `${process.env.BASE_URL}/uploads/${req.file.filename}`
      : "";

    const doc = await Menu.create({
      name,
      category,
      description,
      price: priceNum,
      status,
      image: imageUrl,
    });

    return res.status(201).json({ status: "success", data: doc });
  } catch (error) {
    console.error("createMenu error:", error);
    return res
      .status(500)
      .json({ status: "fail", error: error.message || "Server Error" });
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

    if (name !== undefined) menu.name = name;
    if (category !== undefined) menu.category = category;
    if (description !== undefined) menu.description = description;
    if (status !== undefined) menu.status = status;

    if (price !== undefined) {
      const priceNum = Number(price);
      if (Number.isNaN(priceNum)) {
        return res
          .status(400)
          .json({ status: "fail", error: "price는 숫자여야 합니다." });
      }
      menu.price = priceNum;
    }

    if (req.file) {
      deleteFileIfExists(menu.image);
      const baseUrl =
        process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
      menu.image = `${baseUrl}/uploads/${req.file.filename}`;
    }
    await menu.save();

    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = menuController;
