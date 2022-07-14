var Cources = require("../service/CourcesService");

var model = new Cources();

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
  const classId = req.query.schoolId;
  const courseNameFind = req.query.courseNameFind;
  const courseIdFind = req.query.courseIdFind;
  const studentId = req.query.studentId;
  const semester = req.query.semester;
  const yearId = req.query.yearId;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllManager(id, gradeId, teacherId, schoolId, classId, studentId, semester, yearId, offset, limit, courseNameFind, courseIdFind, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.getCourceNameManager = (req, res) => {
  const id = req.params.id;
  const gradeId = req.query.gradeId;
  const teacherId = req.query.teacherId;
  const schoolId = req.query.schoolId;
  const classId = req.query.schoolId;
  const studentId = req.query.studentId;
  const semester = req.query.semester;
  const yearId = req.query.yearId;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getCourceNameManager(id, gradeId, teacherId, schoolId, classId, studentId, semester, yearId, offset, limit, function (status, data, message, total, headers) {
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
  const classId = req.query.schoolId;
  const studentId = req.query.studentId;
  const courseNameFind = req.query.courseNameFind;
  const courseIdFind = req.query.courseIdFind;
  const semester = req.query.semester;
  const yearId = req.query.yearId;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllAdmin(id, gradeId, teacherId, req.user.id, classId, studentId, semester, yearId, offset, limit, courseNameFind, courseIdFind, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.getCourceNameAdmin = (req, res) => {
  const id = req.params.id;
  const gradeId = req.query.gradeId;
  const teacherId = req.query.teacherId;
  const classId = req.query.schoolId;
  const studentId = req.query.studentId;
  const semester = req.query.semester;
  const yearId = req.query.yearId;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getCourceNameAdmin(id, gradeId, teacherId, req.user.id, classId, studentId, semester, yearId, offset, limit, function (status, data, message, total, headers) {
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


exports.getAllTeacher = (req, res) => {
  const id = req.params.id;
  const gradeId = req.query.gradeId;
  const classId = req.query.classId;
  const courseNameFind = req.query.courseNameFind;
  const courseIdFind = req.query.courseIdFind;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllTeacher(id, gradeId, req.user.id, classId, offset, limit, courseNameFind, courseIdFind, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.getAllTeacherNameCourse = (req, res) => {
  model.getAllTeacherNameCourse(req.user.id, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};