const express = require("express");
const Router = express.Router();
const {updateAdmin, getAllAdmin, getAllManager, createManager, updateManager} = require('../controllers/SchoolController');
const {checkRoleAdmin, checkRoleManager} = require('../middleware/checkRole');
const {verifyToken} = require('../middleware/verifyToken');


Router.route("/manager").get(verifyToken, checkRoleManager, getAllManager)
Router.route("/manager/:id").get(verifyToken, checkRoleManager, getAllManager)
Router.route("/manager").post(verifyToken, checkRoleManager, createManager);
Router.route("/manager").put(verifyToken, checkRoleManager, updateManager);

Router.route("/admin").get(verifyToken, checkRoleAdmin, getAllAdmin)
Router.route("/admin").put(verifyToken,checkRoleAdmin, updateAdmin);


module.exports = Router;
