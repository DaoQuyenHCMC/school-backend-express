const express = require("express");
const Router = express.Router();
const {getAllAdmin, getAllManager, getAllManagerMark, getAllAdminMark} = require('../controllers/StatisticalController');
const {checkRoleAdmin, checkRoleManager} = require('../middleware/checkRole');
const {verifyToken} = require('../middleware/verifyToken');


Router.route("/manager").get(verifyToken, checkRoleManager, getAllManager);
Router.route("/manager/mark").get(verifyToken, checkRoleManager, getAllManagerMark);

Router.route("/admin").get(verifyToken, checkRoleAdmin, getAllAdmin);
Router.route("/admin/mark").get(verifyToken, checkRoleAdmin, getAllAdminMark);


module.exports = Router;
