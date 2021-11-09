const express = require("express");
const Router = express.Router();
const {createStudent, updateStudent, getAll, getById, deleteStudent} = require('../controllers/StudentController')

Router.route("/").get(getAll)
Router.route("/").post(createStudent);
Router.route("/").put(updateStudent);
Router.route("/:id").delete(deleteStudent);
Router.route("/:id").get(getById);

module.exports = Router;
