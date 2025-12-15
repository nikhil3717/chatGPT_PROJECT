const express = require("express");
const { registerController, loginController, logoutController, meController } = require("../controller/auth.controller");


const router = express.Router();

router.post("/register", registerController)
router.post("/login", loginController)
router.post("/logout", logoutController)
router.get("/me", meController)

module.exports = router