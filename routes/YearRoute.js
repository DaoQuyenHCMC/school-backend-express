const express = require("express");
const Router = express.Router();
const {createYear, updateYear, getAll} = require('../controllers/YearController');
const {verifyToken} = require('../middleware/verifyToken');
const {checkRoleAll} = require('../middleware/checkRole');

Router.route("/").get(verifyToken, checkRoleAll, getAll);
Router.route("/:id").get(verifyToken, checkRoleAll, getAll);
Router.route("/").post(verifyToken, checkRoleAll, createYear);
Router.route("/").put(verifyToken, checkRoleAll, updateYear);

module.exports = Router;
