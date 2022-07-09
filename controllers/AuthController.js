var Auth = require("../service/AuthService");

var model = new Auth();

exports.login = (req, res) => {
  model.login(
    req.body.username,
    req.body.password,
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

//Get current user
exports.getCurrentUser = async (req, res) => {
  model.getCurrentUser(
    req.user,
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

exports.getSendForgotPassword = async (req, res) => {
  model.sendForgotPassword(
    req.body.username,
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
