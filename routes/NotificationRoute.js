const express = require("express");
const Router = express.Router();
const {createNotification, updateNotification, getAll, deleteNotification} = require('../controllers/NotificationController')

Router.route("/").get(getAll)
Router.route("/").post(createNotification);
Router.route("/").put(updateNotification);
Router.route("/:id").delete(deleteNotification);
Router.route("/:id").get(getAll);

module.exports = Router;
