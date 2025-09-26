const Menu = require("../models/Menu");
const path = require("path");
const crypto = require("crypto");
const { putImage, getPresignedGetUrl, deleteObject } = require("../lib/s3");
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
      menuList = await Menu.find({ category }).lean();
    } else {
      menuList = await Menu.find().lean();
    }

    const withUrls = await Promise.all(
      menuList.map(async (menu) => {
        let imageUrl = "";
        if (menu.imageKey) {
          imageUrl = await getPresignedGetUrl(menu.imageKey, 600);
        }
        return { ...menu, imageUrl };
      })
    );

    res.status(200).json({ status: "success", menuList: withUrls });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

menuController.getMenuById = async (req, res) => {
  try {
    const menuId = req.params.id;
    const menu = await Menu.findById(menuId).lean();
    if (!menu) throw new Error("fail find menu");

    const imageUrl = await getPresignedGetUrl(menu.imageKey, 600);

    res.status(200).json({ status: "success", data: { ...menu, imageUrl } });
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

    let imageKey = "";
    if (req.file) {
      const ext = (
        path.extname(req.file.originalname || "") || ".jpg"
      ).toLowerCase();
      const safeBase = (name || "image")
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_\-]/g, "");
      const rand = crypto.randomBytes(6).toString("hex");

      imageKey = `menus/${Date.now()}_${safeBase}_${rand}${ext}`;

      await putImage({
        Key: imageKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      });
    }

    const doc = await Menu.create({
      name,
      category,
      description,
      price: priceNum,
      status,
      imageKey,
    });

    let imageUrl = "";
    if (imageKey) imageUrl = await getPresignedGetUrl(imageKey, 300);

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
    const { name, category, description, price, status, removeImage } =
      req.body;

    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ status: "fail", error: "fail find Menu" });
    }
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
      const ext = (
        path.extname(req.file.originalname || "") || ".jpg"
      ).toLowerCase();
      const safeBase = (menu.name || name || "image")
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_\-]/g, "");
      const rand = crypto.randomBytes(6).toString("hex");
      const newKey = `menus/${Date.now()}_${safeBase}_${rand}${ext}`;

      await putImage({
        Key: newKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      });

      if (menu.imageKey) {
        try {
          await deleteObject(menu.imageKey);
        } catch (e) {
          console.warn("S3 deleteObject(old) failed:", e?.message || e);
        }
      }

      menu.imageKey = newKey;
    }

    await menu.save();

    let imageUrl = "";
    if (menu.imageKey) {
      imageUrl = await getPresignedGetUrl(menu.imageKey, 300);
    }

    return res.status(200).json({
      status: "success",
      data: {
        ...menu.toObject(),
        imageUrl,
      },
    });
  } catch (error) {
    console.error("updateMenu error:", error);
    return res
      .status(400)
      .json({ status: "fail", error: error.message || "Update failed" });
  }
};

module.exports = menuController;
