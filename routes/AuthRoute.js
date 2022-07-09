const express = require("express");
const Router = express.Router();
const {login, getCurrentUser, getSendForgotPassword, resetPassword} = require('../controllers/AuthController');
const {checkCurrentUser} = require('../middleware/checkCurrentUser');
const {destroyToken} = require('../middleware/verifyToken');

Router.route("/").get(checkCurrentUser, getCurrentUser);
Router.route("/login").post(login);
Router.route("/logout").post(destroyToken);
Router.route("/send-forgot-password").put(getSendForgotPassword);

module.exports = Router;
