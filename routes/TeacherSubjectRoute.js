const express = require("express");
const Router = express.Router();
const {createTeacherSubject, updateTeacherSubject, getAll, getById, deleteTeacherSubject} = require('../controllers/TeacherSubjectController')

Router.route("/").get(getAll)
Router.route("/").post(createTeacherSubject);
Router.route("/").put(updateTeacherSubject);
Router.route("/:id").delete(deleteTeacherSubject);
Router.route("/:id").get(getById);

module.exports = Router;
