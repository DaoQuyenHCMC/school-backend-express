const express = require("express");
const Router = express.Router();
const {createFamily, updateFamily, getAll, getById, deleteFamily} = require('../controllers/FamilyCotroller')

Router.route("/").get(getAll)
Router.route("/").post(createFamily);
Router.route("/").put(updateFamily);
Router.route("/:id").delete(deleteFamily);
Router.route("/:id").get(getById);

module.exports = Router;
