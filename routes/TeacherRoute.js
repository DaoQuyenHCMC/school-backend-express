const express = require("express");
const Router = express.Router();
const {createTeacher, updateTeacher, getAll, getById, deleteTeacher} = require('../controllers/TeacherController')

Router.route("/").get(getAll)
Router.route("/").post(createTeacher);
Router.route("/").put(updateTeacher);
Router.route("/:id").delete(deleteTeacher);
Router.route("/:id").get(getById);

module.exports = Router;
