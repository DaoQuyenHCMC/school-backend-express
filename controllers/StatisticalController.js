var Statistical = require("../service/StatisticalService");

var model = new Statistical();

exports.getAllManager = (req, res) => {
  const semester = req.query.semester;
  const yearId = req.query.yearId;
  model.getAllManager(req.user.id, semester, yearId, function (status, data, message, total, headers) {
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
  const semester = req.query.semester;
  const yearId = req.query.yearId;
  model.getAllAdmin(req.user.id, semester, yearId, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.getAllManagerMark = (req, res) => {
  const semester = req.query.semester;
  const yearId = req.query.yearId;
  model.getAllManagerMark(req.user.id, semester, yearId, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.getAllAdminMark = (req, res) => {
  const semester = req.query.semester;
  const yearId = req.query.yearId;
  model.getAllAdminMark(req.user.id, semester, yearId, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

