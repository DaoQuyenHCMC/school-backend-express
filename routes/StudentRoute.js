const express = require("express");
const Router = express.Router();
const {createAdmin, updateAdmin, getAllAdmin, transferClassManager, getFamily,
        createManager, updateManager, getAllManager, transferClassAdmin,
        changePasswordStudent, getAllTeacherHomeRoom, getStudent, getAllTeacherCourse } = require('../controllers/StudentController');
const {verifyToken} = require('../middleware/verifyToken');
const {checkRoleAdmin, checkRoleFamily, checkRoleManager, checkRoleTeacher, checkRoleStudent} = require('../middleware/checkRole');

Router.route("/manager").get(verifyToken, checkRoleManager, getAllManager);
Router.route("/manager/:id").get(verifyToken, checkRoleManager, getAllManager);
Router.route("/manager").post(verifyToken, checkRoleManager, createManager);
Router.route("/manager").put(verifyToken, checkRoleManager, updateManager);
Router.route("/manager/transfer-class").put(verifyToken, checkRoleManager, transferClassManager);

Router.route("/admin").get(verifyToken, checkRoleAdmin, getAllAdmin);
Router.route("/admin/:id").get(verifyToken, checkRoleAdmin, getAllAdmin);
Router.route("/admin").post(verifyToken, checkRoleAdmin, createAdmin);
Router.route("/admin").put(verifyToken, checkRoleAdmin, updateAdmin);
Router.route("/admin/transfer-class").put(verifyToken, checkRoleAdmin, transferClassAdmin);

Router.route("/change-password").put(verifyToken, checkRoleStudent, changePasswordStudent);
Router.route("/student").get(verifyToken, checkRoleStudent, getStudent);

Router.route("/family").get(verifyToken, checkRoleFamily, getFamily);
Router.route("/family/:id").get(verifyToken, checkRoleFamily, getFamily);

Router.route("/teacher-homeroom").get(verifyToken, checkRoleTeacher, getAllTeacherHomeRoom);
Router.route("/teacher-homeroom/:id").get(verifyToken, checkRoleTeacher, getAllTeacherHomeRoom);
Router.route("/teacher-course").get(verifyToken, checkRoleTeacher, getAllTeacherCourse);
Router.route("/teacher-course/:id").get(verifyToken, checkRoleTeacher, getAllTeacherCourse);


module.exports = Router;
