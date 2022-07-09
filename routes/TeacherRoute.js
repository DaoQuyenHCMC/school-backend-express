const express = require("express");
const Router = express.Router();
const {createAdmin, updateAdmin, getAllAdmin, getAllManager, createManager, updateManager, 
    deleteAdmin, getAllTeacher, updateTeacher} = require('../controllers/TeacherController');
const {verifyToken} = require('../middleware/verifyToken');
const {checkRoleAdmin, checkRoleManager, checkRoleForTeacher} = require('../middleware/checkRole');

Router.route("/manager").get(verifyToken, checkRoleManager, getAllManager);
Router.route("/manager/:id").get(verifyToken, checkRoleManager, getAllManager);
Router.route("/manager").post(verifyToken, checkRoleManager, createManager);
Router.route("/manager").put(verifyToken, checkRoleManager, updateManager);

Router.route("/admin").get(verifyToken, checkRoleAdmin, getAllAdmin);
Router.route("/admin/:id").get(verifyToken, checkRoleAdmin, getAllAdmin);
Router.route("/admin").post(verifyToken, checkRoleAdmin, createAdmin);
Router.route("/admin").put(verifyToken, checkRoleAdmin, updateAdmin);
Router.route("/admin").delete(verifyToken, checkRoleAdmin, deleteAdmin);

Router.route("/").get(verifyToken, checkRoleForTeacher, getAllTeacher);
Router.route("/").put(verifyToken, checkRoleForTeacher, updateTeacher);



module.exports = Router;
