var Year = require("../service/YearService");

var model = new Year();

exports.createYear = (req, res) => {
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
  
  exports.updateYear = (req, res) => {
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
    const name = req.query.name;
    const offset = req.query.offset;
    const limit = req.query.limit;
    model.getAll(id, name, offset, limit, function (status, data, message, total, headers) {
      res.send({
        status: status,
        data: data,
        message: message,
        total: total,
        headers: headers,
      });
    });
  };
  
