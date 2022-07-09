var Role = require("../service/RoleService");

var model = new Role();

exports.getAll = (req, res) => {
  const id = req.query.id;
  model.getAll(id, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

