const express = require("express");
const { signUp, login } = require("../controller/authController");
const AuthRouter = express.Router();

AuthRouter.post("/login", login);
AuthRouter.post("/register", signUp);

module.exports = AuthRouter;
