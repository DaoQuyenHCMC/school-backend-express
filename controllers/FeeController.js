var Fee = require("../service/FeeService");

var model = new Fee();

exports.createManager = (req, res) => {
  if(req.body.schoolYear || req.body.semesterId || req.body.gradeId){
    model.createListManager(req.body, function (status, data, message, total, headers) {
      res.send({
        status: status,
        data: data,
        message: message,
        total: total,
        headers: headers,
      });
    });
  }else{
    model.createManager(req.body, function (status, data, message, total, headers) {
      res.send({
        status: status,
        data: data,
        message: message,
        total: total,
        headers: headers,
      });
    });
  }
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
  const contactBookId = req.query.contactBookId;
  const studentId = req.query.studentId;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllManager(id, contactBookId, studentId, offset, limit, function (status, data, message, total, headers) {
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
  const contactBookId = req.query.contactBookId;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllStudent(id, contactBookId, req.user.id, offset, limit, function (status, data, message, total, headers) {
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
  const contactBookId = req.query.contactBookId;
  const studentId = req.query.studentId;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllFamily(id, contactBookId, studentId, offset, limit, req.user.id, function (status, data, message, total, headers) {
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
  if(req.body.schoolYear || req.body.semesterId || req.body.gradeId){
    model.createListAdmin(req.body, req.user.id, function (status, data, message, total, headers) {
      res.send({
        status: status,
        data: data,
        message: message,
        total: total,
        headers: headers,
      });
    });
  }else{
    model.createAdmin(req.body, req.user.id, function (status, data, message, total, headers) {
      res.send({
        status: status,
        data: data,
        message: message,
        total: total,
        headers: headers,
      });
    });
  }
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
  const contactBookId = req.query.contactBookId;
  const studentId = req.query.studentId;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllAdmin(id, contactBookId, studentId, req.user.id, offset, limit, function (status, data, message, total, headers) {
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

