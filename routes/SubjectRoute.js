const express = require("express");
const Router = express.Router();
const {createSubject, updateSubject, getAll, getById, deleteSubject} = require('../controllers/SubjectController')

Router.route("/").get(getAll)
Router.route("/").post(createSubject);
Router.route("/").put(updateSubject);
Router.route("/:id").delete(deleteSubject);
Router.route("/:id").get(getById);

module.exports = Router;
