const express = require("express");
const Router = express.Router();
const {getAll} = require('../controllers/RoleController');
const {checkRoleAdmin} = require('../middleware/checkRole');
const {verifyToken} = require('../middleware/verifyToken');

Router.route("/").get(verifyToken, checkRoleAdmin, getAll)


module.exports = Router;
