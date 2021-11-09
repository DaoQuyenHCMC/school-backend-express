const express = require("express");
const Router = express.Router();
const {createContactBook, updateContactBook, getAll, getById, deleteContactBook} = require('../controllers/ContactBookController')

Router.route("/").get(getAll)
Router.route("/").post(createContactBook);
Router.route("/").put(updateContactBook);
Router.route("/:id").delete(deleteContactBook);
Router.route("/:id").get(getById);

module.exports = Router;
