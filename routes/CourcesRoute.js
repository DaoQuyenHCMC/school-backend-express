const express = require("express");
const Router = express.Router();
const {createManager, updateManager, getAllManager, deleteManager, getCourceNameManager, getCourceNameAdmin,
        createAdmin, updateAdmin, getAllAdmin, deleteAdmin, getAllTeacher, getAllTeacherNameCourse} = require('../controllers/CourcesController');
const {verifyToken} = require('../middleware/verifyToken');
const {checkRoleAdmin, checkRoleManager, checkRoleTeacher} = require('../middleware/checkRole');

Router.route("/manager").get(verifyToken, checkRoleManager, getAllManager);
Router.route("/manager-cource-name").get(verifyToken, checkRoleManager, getCourceNameManager);
Router.route("/manager/:id").get(verifyToken, checkRoleManager, getAllManager)
Router.route("/manager").post(verifyToken, checkRoleManager, createManager);
Router.route("/manager").put(verifyToken, checkRoleManager, updateManager);
Router.route("/manager").delete(verifyToken, checkRoleManager, deleteManager);


Router.route("/admin").get(verifyToken, checkRoleAdmin, getAllAdmin);
Router.route("/admin-cource-name").get(verifyToken, checkRoleAdmin, getCourceNameAdmin);
Router.route("/admin/:id").get(verifyToken, checkRoleAdmin, getAllAdmin);
Router.route("/admin").post(verifyToken, checkRoleAdmin, createAdmin);
Router.route("/admin").put(verifyToken, checkRoleAdmin, updateAdmin);
Router.route("/admin").delete(verifyToken, checkRoleAdmin, deleteAdmin);

Router.route("/teacher").get(verifyToken, checkRoleTeacher, getAllTeacher);
Router.route("/teacher-name-course").get(verifyToken, checkRoleTeacher, getAllTeacherNameCourse);
Router.route("/teacher/:id").get(verifyToken, checkRoleTeacher, getAllTeacher);

module.exports = Router
