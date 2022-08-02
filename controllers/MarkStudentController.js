var MarkStudent = require("../service/MarkStudentService");

var model = new MarkStudent();

exports.createManager = (req, res) => {
  model.createManager(req.body, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.updateManager = (req, res) => {
  model.updateManager(req.body, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.getAllManager = (req, res) => {
  const id = req.params.id;
  const contactBookId = req.query.contactBookId;
  const schoolYear = req.query.schoolYear;
  const courseNameFind = req.query.courseNameFind;
  const studentNameFind = req.query.studentNameFind;
  const studentIdFind = req.query.studentIdFind;
  const yearNameFind = req.query.yearNameFind;
  const classNameFind = req.query.classNameFind;
  const studentId = req.query.studentId;
  const courceId = req.query.courceId;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllManager(id, contactBookId, studentId, schoolYear, courceId, offset, limit, courseNameFind, studentNameFind, studentIdFind, yearNameFind, classNameFind, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};


exports.deleteMarkManager = (req, res) => {
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
  model.createAdmin(req.body, req.user.id, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.updateAdmin = (req, res) => {
  model.updateAdmin(req.body, req.user.id, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.getAllAdmin = (req, res) => {
  const id = req.params.id;
  const contactBookId = req.query.contactBookId;
  const studentId = req.query.studentId;
  const schoolYear = req.query.schoolYear;
  const courseNameFind = req.query.courseNameFind;
  const studentNameFind = req.query.studentNameFind;
  const studentIdFind = req.query.studentIdFind;
  const yearNameFind = req.query.yearNameFind;
  const classNameFind = req.query.classNameFind;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllAdmin(id, contactBookId, studentId, req.user.id, schoolYear, offset, limit, courseNameFind, studentNameFind, studentIdFind, yearNameFind, classNameFind, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};
exports.createListAdminFromUpdateCources = (req, res) => {
  const classId = req.query.classId;
  const semester = req.query.semester;
  const schoolYear = req.query.schoolYear;
  model.createListAdminFromUpdateCources(classId, semester, schoolYear, req.user.id, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
}

exports.createListManagerFromUpdateCources = (req, res) => {
  const classId = req.query.classId;
  const semester = req.query.semester;
  const schoolYear = req.query.schoolYear;
  model.createListManagerFromUpdateCources(classId, semester, schoolYear, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
}

exports.deleteMarkAdmin = (req, res) => {
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

exports.updateTeacher = (req, res) => {
  model.updateTeacher(req.body, req.user.id, function (status, data, message, total, headers) {
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
  const id = req.params.id;
  const studentIdFind = req.query.studentIdFind;
  const studentNameFind = req.query.studentNameFind;
  const courseNameFind = req.query.courseNameFind;
  const yearNameFind = req.query.yearNameFind;
  const classNameFind = req.query.classNameFind;
  const contactBookId = req.query.contactBookId;
  const classId = req.query.classId;
  const studentId = req.query.studentId;
  const schoolYear = req.query.schoolYear;
  const courceId = req.query.courceId;
  const semester = req.query.semester;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllTeacher(id, contactBookId, studentId, req.user.id, schoolYear, semester, offset, limit, classId, courceId, studentIdFind, studentNameFind, courseNameFind, yearNameFind, classNameFind, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.getAllTeacherClass = (req, res) => {
  const yearId = req.query.schoolYear;
  const semester = req.query.semester;
  const courseId = req.query.courseId;
  model.getAllTeacherClass(req.user.id, yearId, semester, courseId, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.getAllHomeRoomTeacher = (req, res) => {
  const id = req.params.id;
  const contactBookId = req.query.contactBookId;
  const studentId = req.query.studentId;
  const schoolYear = req.query.schoolYear;
  const semester = req.query.semester;
  model.getAllHomeRoomTeacher(id, contactBookId, studentId, req.user.id, schoolYear, semester, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};


exports.deleteMarkTeacher = (req, res) => {
  const id = req.query.id;
  model.deleteTeacher(id, req.user.id, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.getAllStudent = (req, res) => {
  const id = req.query.id;
  const contactBookId = req.query.contactBookId;
  const schoolYear = req.query.schoolYear;
  const semester = req.query.semester;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllStudent(id, contactBookId, req.user.id, schoolYear, semester, offset, limit, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.getYearStudent = (req, res) => {
  const id = req.query.id;
  const contactBookId = req.query.contactBookId;
  const schoolYear = req.query.schoolYear;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getYearStudent(id, contactBookId, req.user.id, schoolYear, offset, limit, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.getMarkCourceStudent = (req, res) => {
  const id = req.query.id;
  const contactBookId = req.query.contactBookId;
  const schoolYear = req.query.schoolYear;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getMarkCourceStudent(id, contactBookId, req.user.id, schoolYear, offset, limit, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.getAllFamily = (req, res) => {
  const id = req.query.id;
  const contactBookId = req.query.contactBookId;
  const schoolYear = req.query.schoolYear;
  const studentId = req.query.studentId;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllFamily(id, contactBookId, req.user.id, schoolYear, studentId, offset, limit, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

exports.getYearFamily = (req, res) => {
  const id = req.query.id;
  const contactBookId = req.query.contactBookId;
  const schoolYear = req.query.schoolYear;
  model.getYearFamily(id, contactBookId, req.user.id, schoolYear, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};