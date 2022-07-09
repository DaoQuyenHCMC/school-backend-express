const express = require("express");
const Router = express.Router();
const {createManager, updateManager, getAllManager, deleteManager, createAdmin, updateAdmin, getAllAdmin, deleteAdmin} = require('../controllers/GradeController');
const {verifyToken} = require('../middleware/verifyToken');
const {checkRoleAdmin, checkRoleManager} = require('../middleware/checkRole');

Router.route("/manager").get(verifyToken, checkRoleManager, getAllManager)
Router.route("/manager/:id").get(verifyToken, checkRoleManager, getAllManager)
Router.route("/manager").post(verifyToken, checkRoleManager, createManager);
Router.route("/manager").put(verifyToken, checkRoleManager, updateManager);
Router.route("/manager").delete(verifyToken, checkRoleManager, deleteManager);

Router.route("/admin").get(verifyToken, checkRoleAdmin, getAllAdmin)
Router.route("/admin/:id").get(verifyToken, checkRoleAdmin, getAllAdmin)
Router.route("/admin").post(verifyToken, checkRoleAdmin, createAdmin);
Router.route("/admin").put(verifyToken, checkRoleAdmin, updateAdmin);
Router.route("/admin").delete(verifyToken, checkRoleAdmin, deleteAdmin);


module.exports = Router;
