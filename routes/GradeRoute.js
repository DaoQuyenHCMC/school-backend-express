const express = require("express");
const Router = express.Router();
const {createGrade, updateGrade, getAll, deleteGrade} = require('../controllers/GradeController')

Router.route("/").get(getAll)
Router.route("/:id").get(getAll);
Router.route("/").post(createGrade);
Router.route("/").put(updateGrade);
Router.route("/:id").delete(deleteGrade);


module.exports = Router;
