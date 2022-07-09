const express = require("express");
const Router = express.Router();
const {createManager, updateManager, getAll, deleteManager, getAllManager, approveManager, 
        createStudent, getAllStudent, getAllRequestAdminFromStudent, getAllStudentRequest,
        getAllFamily, createFamily, getAllFamilyRequest,
        createCustomer, getAllTeacher, createTeacher, getAllRequestAdminFromTeacher, getAllTeacherRequest, createTeacherCourse, createTeacherHomeroom,
        createAdmin, updateAdmin, getAllAdmin, deleteAdmin, getAllForAdmin, getAllRequestAdmin, approveAdmin} = require('../controllers/NotificationController')
const {verifyToken} = require('../middleware/verifyToken');
const {checkRoleAdmin, checkRoleManager, checkRoleFamily, checkRoleStudent, checkRoleTeacher} = require('../middleware/checkRole');

// Router.route("/").get(getAll)

Router.route("/manager").get(verifyToken, checkRoleManager, getAllManager);
Router.route("/manager/:id").get(verifyToken, checkRoleManager, getAllManager);
Router.route("/manager").post(verifyToken, checkRoleManager, createManager);
Router.route("/manager").put(verifyToken, checkRoleManager, updateManager);
Router.route("/manager").delete(verifyToken, checkRoleManager, deleteManager);
Router.route("/manager/:approve").put(verifyToken, checkRoleManager, approveManager);

Router.route("/admin").get(verifyToken, checkRoleAdmin, getAllAdmin);
Router.route("/admin/:id").get(verifyToken, checkRoleAdmin, getAllAdmin);
Router.route("/admin").post(verifyToken, checkRoleAdmin, createAdmin);
Router.route("/admin").put(verifyToken, checkRoleAdmin, updateAdmin);
Router.route("/admin/:approve").put(verifyToken, checkRoleAdmin, approveAdmin);
Router.route("/admin").delete(verifyToken, checkRoleAdmin, deleteAdmin);
Router.route("/for-admin").get(verifyToken, checkRoleAdmin, getAllForAdmin);
Router.route("/admin-request").get(verifyToken, checkRoleAdmin, getAllRequestAdmin);
Router.route("/admin-request-teacher").get(verifyToken, checkRoleAdmin, getAllRequestAdminFromTeacher);
Router.route("/admin-request-student").get(verifyToken, checkRoleAdmin, getAllRequestAdminFromStudent);

// Router.route("/customer").post(verifyToken, checkRoleAll, createCustomer);

Router.route("/student").get(verifyToken, checkRoleStudent, getAllStudent);
Router.route("/student/:id").get(verifyToken, checkRoleStudent, getAllStudent);
Router.route("/student-request").get(verifyToken, checkRoleStudent, getAllStudentRequest);
Router.route("/student").post(verifyToken, checkRoleStudent, createStudent);

Router.route("/teacher").get(verifyToken, checkRoleTeacher, getAllTeacher);
Router.route("/teacher/:id").get(verifyToken, checkRoleTeacher, getAllTeacher);
Router.route("/teacher-class").post(verifyToken, checkRoleTeacher, createTeacher);
Router.route("/teacher-course").post(verifyToken, checkRoleTeacher, createTeacherCourse);
Router.route("/teacher-homeroom").post(verifyToken, checkRoleTeacher, createTeacherHomeroom);
Router.route("/teacher-request").get(verifyToken, checkRoleTeacher, getAllTeacherRequest);

Router.route("/family").get(verifyToken, checkRoleFamily, getAllFamily);
Router.route("/family/:id").get(verifyToken, checkRoleFamily, getAllFamily);
Router.route("/family-request").get(verifyToken, checkRoleFamily, getAllFamilyRequest);
Router.route("/family").post(verifyToken, checkRoleFamily, createFamily);

module.exports = Router;


