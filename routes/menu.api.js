const express = require("express");
const authController = require("../controllers/auth.controller");
const menuController = require("../controllers/menu.controller");
const upload = require("../middlewares/upload");
const router = express.Router();

router.get("/", menuController.getMenuList);
router.get("/random", menuController.getMenuRandom);
router.get("/:id", menuController.getMenuById);
router.post(
  "/",
  authController.authenticate,
  authController.checkAdminPermission,
  upload.single("image"),
  menuController.createMenu
);

router.put(
  "/:id",
  authController.authenticate,
  authController.checkAdminPermission,
  upload.single("image"),
  menuController.updateMenu
);

router.delete(
  "/",
  authController.authenticate,
  authController.checkAdminPermission,
  menuController.deleteMenuListById
);

module.exports = router;
