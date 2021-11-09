var Semeter = require("../models/Semester");

var model = new Semeter();

exports.createSemeter = (req, res, next) => {
  model.create(req.body, function (err, data) {
    res.send({ result: data, error: err });
  });
};

exports.updateSemeter = (req, res, next) => {
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


exports.deleteSemeter = (req, res, next) => {
  console.log("hello")
  model.delete(req.params.id, function (err, data) {
    res.send({ result: data, error: err });
  });
};
