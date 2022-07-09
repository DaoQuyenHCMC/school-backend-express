var Teacher = require("../service/TeacherService");

var model = new Teacher();

exports.getAllManager = (req, res) => {
  const id = req.params.id;
  const schoolId = req.query.schoolId;
  const teacherIdFind = req.query.teacherIdFind;
  const teacherNameFind = req.query.teacherNameFind;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllManager(id, schoolId, teacherIdFind, offset, limit, teacherNameFind, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.createManager = (req, res) => {
  model.createManager(
    req.user.id,
    req.body,
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

exports.updateManager = (req, res) => {
  oldPassword = req.body.oldPassword;
  newPassword = req.body.newPassword;
  if (oldPassword || newPassword) {
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
  } else {
    model.updateManager(
      req.user.id,
      req.body,
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
  }
};

exports.deleteManager = (req, res) => {
  const id = req.query.id;
  model.deleteManager(id, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};


exports.createAdmin = (req, res) => {
  model.createAdmin(
    req.user.id,
    req.body,
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

exports.updateAdmin = (req, res) => {
  oldPassword = req.body.oldPassword;
  newPassword = req.body.newPassword;
  if (oldPassword || newPassword) {
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
  } else {
    model.updateAdmin(
      req.user.id,
      req.body,
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
  }
};


exports.getAllAdmin = (req, res) => {
  const id = req.params.id;
  const teacherIdFind = req.query.teacherIdFind;
  const offset = req.query.offset;
  const limit = req.query.limit;
  const teacherNameFind = req.query.teacherNameFind;
  model.getAllAdmin(id, req.user.id, teacherIdFind, offset, limit, teacherNameFind, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.deleteAdmin = (req, res) => {
  const id = req.query.id;
  model.deleteAdmin(id, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.getAllTeacher = (req, res) => {
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllTeacher(req.user.id, offset, limit, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};


exports.updateTeacher = (req, res) => {
  oldPassword = req.body.oldPassword;
  newPassword = req.body.newPassword;
  if (oldPassword || newPassword) {
   
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
  } else {
    model.updateTeacher(
      req.user.id,
      req.body,
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
  }
};