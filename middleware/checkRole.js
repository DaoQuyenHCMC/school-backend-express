var Auth = require("../models/Auth");
var Student = require("../models/Student");
var Teacher = require("../models/Teacher");

var modelStudent = new Student();
var model = new Auth();
var modelTeacher = new Teacher();

exports.checkRoleAdmin = async (req, res, next) => {
  try {
    const dataTeacher = await model.checkRoleAdminManager(req.user.id, 'ADMIN');
    if (dataTeacher.recordset.length != 0) return next();
    res.sendStatus(403);
  } catch (error) {
    res.sendStatus(403);
  }
};

exports.checkRoleManager = async (req, res, next) => {
  try {
    const dataTeacher = await model.checkRoleAdminManager(req.user.id, 'MANAGER');
    if (dataTeacher.recordset.length != 0) return next();
    res.sendStatus(403);
  } catch (error) {
    res.sendStatus(403);
  }
};

exports.checkRoleTeacher = async (req, res, next) => {
  try {
    const dataTeacher = await model.checkRoleAdminManager(req.user.id, 'TEACHER');
    if (dataTeacher.recordset.length != 0) return next();
    res.sendStatus(403);
  } catch (error) {
    res.sendStatus(403);
  }
};


exports.checkRoleAll = async (req, res, next) => {
  try {
    const dataStudent = await modelStudent.getOne(req.user.id);
    const dataTeacher = await modelTeacher.getOne(req.user.id);
    if (dataStudent.recordset.length != 0 || dataTeacher.recordset.length != 0) return next();
    res.sendStatus(403);
  } catch (error) {
    res.sendStatus(403);
  }
};

exports.checkRoleForTeacher = async (req, res, next) => {
  try {
    const dataTeacher = await modelTeacher.getOne(req.user.id);
    if (dataTeacher.recordset.length != 0) return next();
    res.sendStatus(403);
  } catch (error) {
    res.sendStatus(403);
  }
};

exports.checkRoleStudent = async (req, res, next) => {
  try {
    const dataStudent = await modelStudent.getOne(req.user.id);
    if (dataStudent.recordset.length != 0) return next();
    res.sendStatus(403);
  } catch (error) {
    res.sendStatus(403);
  }
};

exports.checkRoleAdminManager = async (req, res, next) => {
  try {
    const dataManager = await model.checkRoleAdminManager(req.user.id, 'MANAGER');
    const dataAdmin = await model.checkRoleAdminManager(req.user.id, 'ADMIN');
    if (dataAdmin.recordset.length != 0 || dataManager.recordset.length != 0) return next();
    res.sendStatus(403);
  } catch (error) {
    res.sendStatus(403);
  }
};


exports.checkRoleFamily = async (req, res, next) => {
  try {
    const data = await model.checkRoleFamily(req.user.id);
    if (data.recordset.length != 0) return next();
    res.sendStatus(403);
  } catch (error) {
    res.sendStatus(403);
  }
};