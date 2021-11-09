var Student = require("../models/Student");
const jwt = require("jsonwebtoken");

var model = new Student();

exports.createStudent = (req, res) => {
  model.create(req.body, function (err, data) {
    if (err) {
      res.send({
        status: "failed",
      });
    } else {
      const token = jwt.sign(
        { id: data.id},
        process.env.APP_SECRET
      );
      res.send({
        data: {token, id: data.id},
        status: "success",
      });
    }
  });
};

exports.updateStudent = (req, res) => {
  model.update(req.body, function (err, data) {
    res.send({ result: data, error: err });
  });
};

exports.getAll = (req, res) => {
  model.getAll(function (err, data) {
    res.send({ result: data, error: err });
  });
};

exports.getById = (req, res) => {
  model.getOne(req.params.id, function (err, data) {
    res.send({ result: data, error: err });
  });
};

exports.deleteStudent = (req, res) => {
  model.delete(req.params.id, function (err, data) {
    res.send({ result: data, error: err });
  });
};
