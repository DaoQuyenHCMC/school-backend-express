var ExtracurricularActivitiesService = require("../service/ExtracurricularActivitiesService");

var model = new ExtracurricularActivitiesService();

exports.createExtracurricularActivities = (req, res) => {
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

exports.updateExtracurricularActivities = (req, res) => {
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
  model.getAll(req.params.id, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};


exports.deleteExtracurricularActivities = (req, res) => {
  model.delete(req.params.id, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};
