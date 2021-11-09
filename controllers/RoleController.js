var Role = require("../models/Role");

var model = new Role();

exports.createRole = (req, res, next) => {
  model.create(req.body, function (err, data) {
    res.send({ result: data, error: err });
  });
};

exports.updateRole = (req, res, next) => {
  model.update(req.body, function (err, data) {
    res.send({ result: data, error: err });
  });
};

exports.getAll = (req, res) => {
  model.getAll(function (err, data) {
    res.send({ result: data, error: err });
  });
};

exports.getById = (req, res, next) => {
  model.getOne(req.params.id, function (err, data) {
    res.send({ result: data, error: err });
  });
};


exports.deleteRole = (req, res, next) => {
  console.log("hello")
  model.delete(req.params.id, function (err, data) {
    res.send({ result: data, error: err });
  });
};
