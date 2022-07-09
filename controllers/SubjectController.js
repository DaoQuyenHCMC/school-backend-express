var Subject = require("../service/SubjectService");

var model = new Subject();

exports.createSubject = (req, res) => {
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

exports.updateSubject = (req, res) => {
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

exports.deleteSubject = (req, res) => {
  const id = req.query.id;
  model.delete(id, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};
