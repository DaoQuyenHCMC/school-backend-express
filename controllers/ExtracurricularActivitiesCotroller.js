var ExtracurricularActivitiesService = require("../service/ExtracurricularActivitiesService");

var model = new ExtracurricularActivitiesService();

exports.getAll = (req, res) => {
  const id = req.query.id;
  const schoolId = req.query.schoolId;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAll(id, schoolId, offset, limit, function (status, data, message, total, headers) {
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
  const schoolId = req.query.schoolId;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllManager(id, schoolId, offset, limit, function (status, data, message, total, headers) {
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
  const schoolId = req.query.schoolId;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllAdmin(id, schoolId, req.user.id, offset, limit, function (status, data, message, total, headers) {
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
