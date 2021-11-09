var Family = require("../models/Family");

var model = new Family();

exports.createFamily = (req, res, next) => {
  model.create(req.body, function (err, data) {
    res.send({ result: data, error: err });
  });
};

exports.updateFamily = (req, res, next) => {
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


exports.deleteFamily = (req, res, next) => {
  model.delete(req.params.id, function (err, data) {
    res.send({ result: data, error: err });
  });
};
