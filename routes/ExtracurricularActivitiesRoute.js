const express = require("express");
const Router = express.Router();
const {createExtracurricularActivities, updateExtracurricularActivities, getAll, getById, deleteExtracurricularActivities} = require('../controllers/ExtracurricularActivitiesCotroller')

Router.route("/").get(getAll)
Router.route("/:id").get(getAll);
Router.route("/").post(createExtracurricularActivities);
Router.route("/").put(updateExtracurricularActivities);
Router.route("/:id").delete(deleteExtracurricularActivities);


module.exports = Router;
