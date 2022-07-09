var Notification = require('../service/NotificationService');

var model = new Notification();

exports.getAll = (req, res) => {
  const id = req.query.id;
  const extracurricularActivitiesId = req.query.extracurricularActivitiesId;
  const schoolId = req.query.schoolId;
  model.getAll(id, extracurricularActivitiesId, schoolId, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.createManager = (req, res) => {
  model.createManager(req.body, req.user.id, function (status, data, message, total, headers) {
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
  model.updateManager(req.body, req.user.id, function (status, data, message, total, headers) {
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
  const extracurricularActivitiesId = req.query.extracurricularActivitiesId;
  const schoolId = req.query.schoolId;
  const status = req.query.status;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllManager(id, extracurricularActivitiesId, schoolId, status, offset, limit, function (status, data, message, total, headers) {
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

exports.createStudent = (req, res) => {
  model.createStudent(req.body, req.user.id, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.createFamily = (req, res) => {
  model.createFamily(req.body, req.user.id, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.createTeacher = (req, res) => {
  model.createTeacher(req.body, req.user.id, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.createTeacherCourse = (req, res) => {
  model.createTeacherCourse(req.body, req.user.id, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.createTeacherHomeroom = (req, res) => {
  model.createTeacherHomeroom(req.body, req.user.id, function (status, data, message, total, headers) {
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

exports.approveAdmin = (req, res) => {
  const approve = req.params.approve;
  const id = req.query.id;
  model.approveAdmin(id, approve, req.user.id, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.approveManager = (req, res) => {
  const approve = req.params.approve;
  const id = req.query.id;
  model.approveManager(id, approve, req.user.id, function (status, data, message, total, headers) {
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
  const extracurricularActivitiesId = req.query.extracurricularActivitiesId;
  const schoolId = req.query.schoolId;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllAdmin(id, extracurricularActivitiesId, schoolId, req.user.id, offset, limit, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.getAllStudent = (req, res) => {
  const id = req.params.id;
  const extracurricularActivitiesId = req.query.extracurricularActivitiesId;
  const schoolId = req.query.schoolId;
  const status = req.query.status;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllStudent(id, extracurricularActivitiesId, schoolId, req.user.id, status, offset, limit, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.getAllFamily = (req, res) => {
  const id = req.params.id;
  const extracurricularActivitiesId = req.query.extracurricularActivitiesId;
  const status = req.query.status;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllFamily(id, extracurricularActivitiesId, req.user.id, status, offset, limit, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.getAllStudentRequest = (req, res) => {
  const id = req.params.id;
  const extracurricularActivitiesId = req.query.extracurricularActivitiesId;
  const status = req.query.status;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllStudentRequest(id, extracurricularActivitiesId, req.user.id, status, offset, limit, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.getAllFamilyRequest = (req, res) => {
  const id = req.params.id;
  const extracurricularActivitiesId = req.query.extracurricularActivitiesId;
  const status = req.query.status;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllStudentRequest(id, extracurricularActivitiesId, req.user.id, status, offset, limit, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.getAllForAdmin = (req, res) => {
  const id = req.params.id;
  const extracurricularActivitiesId = req.query.extracurricularActivitiesId;
  const schoolId = req.query.schoolId;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllForAdmin(id, extracurricularActivitiesId, schoolId, req.user.id, offset, limit, function (status, data, message, total, headers) {
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
  const extracurricularActivitiesId = req.query.extracurricularActivitiesId;
  const status = req.query.status;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllTeacher(id, extracurricularActivitiesId, req.user.id, status, offset, limit, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.getAllTeacherRequest = (req, res) => {
  const id = req.params.id;
  const extracurricularActivitiesId = req.query.extracurricularActivitiesId;
  const status = req.query.status;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllTeacherRequest(id, extracurricularActivitiesId, req.user.id, status, offset, limit, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.getAllRequestAdmin = (req, res) => {
  const status = req.query.status;
  const purpose = req.query.purpose;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllRequestAdmin(req.user.id, status, purpose, offset, limit, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};


exports.getAllRequestAdminFromTeacher = (req, res) => {
  const status = req.query.status;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllRequestAdminFromTeacher(req.user.id, status, offset, limit, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.getAllRequestAdminFromStudent = (req, res) => {
  const status = req.query.status;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllRequestAdminFromStudent(req.user.id, status, offset, limit, function (status, data, message, total, headers) {
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

exports.createCustomer = (req, res) => {
  model.createCustomer(req.body, req.user.id, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};