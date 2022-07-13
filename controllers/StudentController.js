var Student = require("../service/StudentService");

var model = new Student();

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
};

exports.getAllManager = (req, res) => {
  const id = req.params.id;
  const classId = req.query.classId;
  const teacherId = req.query.teacherId;
  const schoolId = req.query.schoolId;
  const gradeId = req.query.gradeId;
  const studentIdFind = req.query.studentIdFind;
  const studentNameFind = req.query.studentNameFind;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllManager(id, classId, teacherId, schoolId, gradeId, studentIdFind, offset, limit, studentNameFind, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
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

exports.transferClassManager = (req, res) => {
  const oldClass = req.query.oldClass;
  const newClass = req.query.newClass;
  model.transferClassManager(oldClass, newClass, function (status, data, message, total, headers) {
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
};

exports.getAllAdmin = (req, res) => {
  const id = req.params.id;
  const classId = req.query.classId;
  const teacherId = req.query.teacherId;
  const schoolId = req.query.schoolId;
  const gradeId = req.query.gradeId;
  const studentIdFind = req.query.studentIdFind;
  const studentNameFind = req.query.studentNameFind;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllAdmin(id, classId, teacherId, schoolId, gradeId, req.user.id, studentIdFind, offset, limit, studentNameFind, function (status, data, message, total, headers) {
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
  model.deleteAdmin(id, req.user.id, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.transferClassAdmin = (req, res) => {
  const oldClass = req.query.oldClass;
  const newClass = req.query.newClass;
  model.transferClassAdmin(oldClass, newClass, req.user.id, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.changePasswordStudent = (req, res) => {
  oldPassword = req.body.oldPassword;
  newPassword = req.body.newPassword;
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
};

exports.getAllTeacherHomeRoom = (req, res) => {
  const id = req.params.id;
  const classId = req.query.classId;
  const gradeId = req.query.gradeId;
  const studentIdFind = req.query.studentIdFind;
  const studentNameFind = req.query.studentNameFind;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllTeacherHomeRoom(id, classId,gradeId, studentIdFind, req.user.id, offset, limit, studentNameFind, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.getAllTeacherCourse = (req, res) => {
  const id = req.params.id;
  const classId = req.query.classId;
  const gradeId = req.query.gradeId;
  const studentIdFind = req.query.studentIdFind;
  const studentNameFind = req.query.studentNameFind;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllTeacherCourse(id, classId,gradeId, studentIdFind, req.user.id, offset, limit, studentNameFind, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.getStudent = (req, res) => {
  model.getStudent(req.user.id, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.getFamily = (req, res) => {
  const studentId = req.params.id;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getFamily(req.user.id, offset, limit, studentId, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};