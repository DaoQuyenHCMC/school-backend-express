const express = require("express");
const Router = express.Router();
const {create, update, getAll, changePassword, getAllFamily} = require('../controllers/FamilyCotroller');
const {verifyToken} = require('../middleware/verifyToken');
const {checkRoleAdminManager, checkRoleFamily} = require('../middleware/checkRole');

Router.route("/manager").get(verifyToken, checkRoleAdminManager, getAll);
Router.route("/manager/:id").get(verifyToken, checkRoleAdminManager, getAll)
Router.route("/manager").post(verifyToken, checkRoleAdminManager, create);
Router.route("/manager").put(verifyToken, checkRoleAdminManager, update);

Router.route("/family").get(verifyToken, checkRoleFamily, getAllFamily);
Router.route("/change-password").put(verifyToken, checkRoleFamily, changePassword);
module.exports = Router;
