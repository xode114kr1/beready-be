const express = require("express");
const authController = require("../controllers/auth.controller");
const menuController = require("../controllers/menu.controller");
const router = express.Router();

router.get("/", menuController.getMenuList);
router.post(
  "/",
  authController.authenticate,
  authController.checkAdminPermission,
  menuController.createMenu
);
router.get("/random", menuController.getMenuRandom);
router.delete(
  "/",
  authController.authenticate,
  authController.checkAdminPermission,
  menuController.deleteMenuListById
);

module.exports = router;
