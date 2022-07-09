const express = require("express");
const Router = express.Router();
const {createSubject, updateSubject, getAll, deleteSubject} = require('../controllers/SubjectController');
const {verifyToken} = require('../middleware/verifyToken');
const {checkRoleAll, checkRoleManager, checkRoleAdmin} = require('../middleware/checkRole');

Router.route("/").get(verifyToken, checkRoleAll, getAll);
Router.route("/:id").get(verifyToken, checkRoleAll, getAll);

Router.route("/").post(verifyToken, checkRoleAdmin, createSubject);
Router.route("/").put(verifyToken, checkRoleAdmin, updateSubject);

Router.route("/").post(verifyToken, checkRoleManager, createSubject);
Router.route("/").put(verifyToken, checkRoleManager, updateSubject);

module.exports = Router;
