const express = require("express");
const Router = express.Router();
const {createRole, updateRole, getAll, getById, deleteRole} = require('../controllers/RoleController')

Router.route("/").get(getAll)
Router.route("/").post(createRole);
Router.route("/").put(updateRole);
Router.route("/:id").delete(deleteRole);
Router.route("/:id").get(getById);

module.exports = Router;
