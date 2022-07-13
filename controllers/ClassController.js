var Class = require("../service/ClassService");

var model = new Class();

exports.createManager = (req, res) => {
  model.createManager(req.body, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.updateManager = (req, res) => {
  model.updateManager(req.body, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.getAllManager = (req, res) => {
  const id = req.params.id;
  const gradeId = req.query.gradeId;
  const teacherId = req.query.teacherId;
  const schoolId = req.query.schoolId;
  const className = req.query.className;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllManager(id, gradeId, teacherId, schoolId, offset, limit, className, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.deleteManager = (req, res) => {
  const id = req.query.id;
  model.deleteManager(id, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.resetTeacherManager = (req, res) => {
  const classId = req.query.id;
  const teacherId = req.query.teacherId;
  const schoolId = req.query.schoolId;
  const gradeId = req.query.gradeId;
  model.resetTeacherManager(classId, gradeId, teacherId, schoolId, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};


exports.createAdmin = (req, res) => {
  model.createAdmin(req.body, req.user.id, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.updateAdmin = (req, res) => {
  model.updateAdmin(req.body, req.user.id, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.getAllAdmin = (req, res) => {
  const id = req.params.id;
  const gradeId = req.query.gradeId;
  const teacherId = req.query.teacherId;
  const className = req.query.className;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllAdmin(id, gradeId, teacherId, req.user.id, offset, limit, className, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.deleteAdmin = (req, res) => {
  const id = req.query.id;
  model.deleteAdmin(id, req.user.id, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.resetTeacherAdmin = (req, res) => {
  const classId = req.query.id;
  const teacherId = req.query.teacherId;
  const gradeId = req.query.gradeId;
  model.resetTeacherAdmin(classId, gradeId, teacherId, req.user.id, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};


exports.getAllTeacher = (req, res) => {
  const id = req.params.id;
  const gradeId = req.query.gradeId;
  const offset = req.query.offset;
  const limit = req.query.limit
  model.getAllTeacher(id, gradeId, req.user.id, offset, limit, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};