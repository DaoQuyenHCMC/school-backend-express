const express = require("express");
const Router = express.Router();
const {createClass, updateClass, getAll, getById, deleteClass} = require('../controllers/ClassCotroller')

Router.route("/").get(getAll)
Router.route("/").post(createClass);
Router.route("/").put(updateClass);
Router.route("/:id").delete(deleteClass);
Router.route("/:id").get(getById);

module.exports = Router;
