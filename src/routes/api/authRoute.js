const express = require("express");
const router = express.Router();
const controller = require("../../controllers/index");

router.post("/login", controller.authController.Login);
router.post("/register", controller.authController.Register);
router.get("/logout", controller.authController.LogOut);
router.get("/refresh-token", controller.refreshTokenController.RefreshToken);

module.exports = router;
