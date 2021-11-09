const express = require("express");
const Router = express.Router();
const {createFee, updateFee, getAll, getById, deleteFee} = require('../controllers/FeeController')

Router.route("/").get(getAll)
Router.route("/").post(createFee);
Router.route("/").put(updateFee);
Router.route("/:id").delete(deleteFee);
Router.route("/:id").get(getById);

module.exports = Router;
