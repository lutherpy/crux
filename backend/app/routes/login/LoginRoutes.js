const express = require("express");
const loginController = require("../../controllers/login/LoginController");
const { validateLogin, loginUser } = loginController;
const router = express.Router();

router.post("/", validateLogin, loginUser);

module.exports = router;
