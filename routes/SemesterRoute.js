const express = require("express");
const Router = express.Router();
const {createSemeter, updateSemeter, getAll, getById, deleteSemeter} = require('../controllers/SemesterController')

Router.route("/").get(getAll)
Router.route("/").post(createSemeter);
Router.route("/").put(updateSemeter);
Router.route("/:id").delete(deleteSemeter);
Router.route("/:id").get(getById);

module.exports = Router;
