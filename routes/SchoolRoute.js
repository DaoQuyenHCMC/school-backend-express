const express = require("express");
const Router = express.Router();
const {createSchool, updateSchool, getAll, deleteSchool} = require('../controllers/SchoolController')

Router.route("/").get(getAll)
Router.route("/:id").get(getAll);
Router.route("/").post(createSchool);
Router.route("/").put(updateSchool);
Router.route("/:id").delete(deleteSchool);


module.exports = Router;
