const express = require("express");
const Router = express.Router();
const {createManager, updateManager, getAllStudent, deleteManager, getAllManager,
        createAdmin, updateAdmin, deleteAdmin, getAllAdmin, getAllTeacher, getAllFamily,
        createTeacher, updateTeacher, deleteTeacher} = require('../controllers/ContactBookController')
const {verifyToken} = require('../middleware/verifyToken');
const {checkRoleAdmin, checkRoleAll, checkRoleManager, checkRoleTeacher, checkRoleFamily} = require('../middleware/checkRole');

Router.route("/student").get(verifyToken, checkRoleAll, getAllStudent);

Router.route("/manager").get(verifyToken, checkRoleManager, getAllManager);
Router.route("/manager/:id").get(verifyToken, checkRoleManager, getAllManager);
Router.route("/manager").post(verifyToken, checkRoleManager, createManager);
// Router.route("/manager").put(verifyToken, checkRoleManager, updateManager);
Router.route("/manager").delete(verifyToken, checkRoleManager, deleteManager);

Router.route("/admin").get(verifyToken, checkRoleAdmin, getAllAdmin);
Router.route("/admin/:id").get(verifyToken, checkRoleAdmin, getAllAdmin);
Router.route("/admin").post(verifyToken, checkRoleAdmin, createAdmin);
Router.route("/admin").delete(verifyToken, checkRoleAdmin, deleteAdmin);

Router.route("/teacher").get(verifyToken, checkRoleTeacher, getAllTeacher);
Router.route("/teacher/:id").get(verifyToken, checkRoleTeacher, getAllTeacher);
Router.route("/teacher").post(verifyToken, checkRoleTeacher, createTeacher);
Router.route("/teacher").delete(verifyToken, checkRoleTeacher, deleteTeacher);

Router.route("/family").get(verifyToken, checkRoleFamily, getAllFamily);
Router.route("/family/:id").get(verifyToken, checkRoleFamily, getAllFamily);

module.exports = Router;
