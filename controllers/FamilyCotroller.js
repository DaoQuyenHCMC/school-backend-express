var Family = require("../service/FamilyService");

var model = new Family();

exports.create = (req, res) => {
  model.create(req.body, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.update = (req, res) => {
  model.update(req.body, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.getAll = (req, res) => {
  const id = req.params.id;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAll(id, offset, limit, function (status, data, message, total, headers) {
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
  model.getAllFamily(req.user.id, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.changePassword = (req, res) => {
  oldPassword = req.body.oldPassword;
  newPassword = req.body.newPassword;
  model.updatePassword(
    req.user.id,
    oldPassword,
    newPassword,
    function (status, data, message, total, headers) {
      res.send({
        status: status,
        data: data,
        message: message,
        total: total,
        headers: headers,
      });
    }
  );
};