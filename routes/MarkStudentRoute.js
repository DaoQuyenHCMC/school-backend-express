const express = require("express");
const Router = express.Router();
const {createManager, updateManager, getAllManager, deleteMarkManager, getYearFamily, getAllFamily, getMarkCourceStudent, createListManagerFromUpdateCources,
        updateTeacher, getAllTeacher, getAllHomeRoomTeacher, getAllTeacherClass,
        createAdmin, updateAdmin, getAllAdmin, deleteMarkAdmin, createListAdminFromUpdateCources,
        getAllStudent, getYearStudent} = require('../controllers/MarkStudentController');
const {verifyToken} = require('../middleware/verifyToken');
const {checkRoleAdmin, checkRoleFamily, checkRoleManager, checkRoleTeacher, checkRoleStudent} = require('../middleware/checkRole');

Router.route("/student").get(verifyToken, checkRoleStudent, getAllStudent);
Router.route("/student-year").get(verifyToken, checkRoleStudent, getYearStudent);
Router.route("/student-mark-cource").get(verifyToken, checkRoleStudent, getMarkCourceStudent);

Router.route("/family").get(verifyToken, checkRoleFamily, getAllFamily);

Router.route("/manager").get(verifyToken, checkRoleManager, getAllManager);
Router.route("/manager/:id").get(verifyToken, checkRoleManager, getAllManager);
Router.route("/manager").post(verifyToken, checkRoleManager, createManager);
Router.route("/manager-create-from-course").post(verifyToken, checkRoleManager, createListManagerFromUpdateCources);
Router.route("/manager").put(verifyToken, checkRoleManager, updateManager);
Router.route("/manager").delete(verifyToken, checkRoleManager, deleteMarkManager);

Router.route("/admin").get(verifyToken, checkRoleAdmin, getAllAdmin);
Router.route("/admin/:id").get(verifyToken, checkRoleAdmin, getAllAdmin);
Router.route("/admin").post(verifyToken, checkRoleAdmin, createAdmin);
Router.route("/admin-create-from-course").post(verifyToken, checkRoleAdmin, createListAdminFromUpdateCources);
Router.route("/admin").put(verifyToken, checkRoleAdmin, updateAdmin);
Router.route("/admin").delete(verifyToken, checkRoleAdmin, deleteMarkAdmin);

Router.route("/teacher").get(verifyToken, checkRoleTeacher, getAllTeacher);
Router.route("/teacher/:id").get(verifyToken, checkRoleTeacher, getAllTeacher);
Router.route("/homeroom-teacher/:id").get(verifyToken, checkRoleTeacher, getAllHomeRoomTeacher);
Router.route("/homeroom-teacher").get(verifyToken, checkRoleTeacher, getAllHomeRoomTeacher);
Router.route("/teacher").put(verifyToken, checkRoleTeacher, updateTeacher);
Router.route("/teacher-class").get(verifyToken, checkRoleTeacher, getAllTeacherClass);

module.exports = Router;
