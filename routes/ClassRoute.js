const express = require("express");
const Router = express.Router();
const {createManager, updateManager, getAllManager, deleteManager, resetTeacherManager, resetTeacherAdmin,
        createAdmin, updateAdmin, getAllAdmin, deleteAdmin, getAllTeacher} = require('../controllers/ClassController');
const {verifyToken} = require('../middleware/verifyToken');
const {checkRoleAdmin, checkRoleManager, checkRoleTeacher} = require('../middleware/checkRole');

Router.route("/manager").get(verifyToken, checkRoleManager, getAllManager);
Router.route("/manager/:id").get(verifyToken, checkRoleManager, getAllManager)
Router.route("/manager").post(verifyToken, checkRoleManager, createManager);
Router.route("/manager").put(verifyToken, checkRoleManager, updateManager);
// Router.route("/manager").delete(verifyToken, checkRoleManager, deleteManager);
Router.route("/manager/reset-teacher").put(verifyToken, checkRoleManager, resetTeacherManager);


Router.route("/admin").get(verifyToken, checkRoleAdmin, getAllAdmin);
Router.route("/admin/:id").get(verifyToken, checkRoleAdmin, getAllAdmin);
Router.route("/admin").post(verifyToken, checkRoleAdmin, createAdmin);
Router.route("/admin").put(verifyToken, checkRoleAdmin, updateAdmin);
// Router.route("/admin").delete(verifyToken, checkRoleAdmin, deleteAdmin);
Router.route("/admin/reset-teacher").put(verifyToken, checkRoleAdmin, resetTeacherAdmin);

Router.route("/teacher").get(verifyToken, checkRoleTeacher, getAllTeacher);
Router.route("/teacher/:id").get(verifyToken, checkRoleTeacher, getAllTeacher);

module.exports = Router
