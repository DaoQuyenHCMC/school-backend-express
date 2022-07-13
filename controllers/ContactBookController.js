var ContactBook = require("../service/ContactBookService");

var model = new ContactBook();

exports.getAllStudent = (req, res) => {
  const id = req.query.id;
  const semester = req.query.semester;
  const schoolYear = req.query.schoolYear;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllStudent(id, req.user.id, semester, schoolYear, offset, limit, function (status, data, message, total, headers) {
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
  const id = req.params.id;
  const semester = req.query.semester;
  const schoolYear = req.query.schoolYear;
  const studentId = req.query.studentId;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllFamily(id, req.user.id, semester, schoolYear, offset, limit, studentId, function (status, data, message, total, headers) {
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

exports.createManager = (req, res) => {
  const classId = req.query.classId;
  const semester = req.query.semester;
  const schoolYear = req.query.schoolYear;
  if(classId){
    model.createListManager(classId, semester, schoolYear, function (status, data, message, total, headers) {
      res.send({
        status: status,
        data: data,
        message: message,
        total: total,
        headers: headers,
      });
    });
  }else{
    model.createManager(req.body, function (status, data, message, total, headers) {
      res.send({
        status: status,
        data: data,
        message: message,
        total: total,
        headers: headers,
      });
    });
  }
  
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
  const studentId = req.query.studentId;
  const teacherId = req.query.teacherId;
  const schoolYear = req.query.schoolYear;
  const studentName = req.query.studentName;
  const semester = req.query.semester;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllManager(id, studentId, teacherId, schoolYear, studentName, semester, offset, limit, function (status, data, message, total, headers) {
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

exports.createAdmin = (req, res) => {
  const classId = req.query.classId;
  const semester = req.query.semester;
  const schoolYear = req.query.schoolYear;
  if(classId){
    model.createListAdmin(classId, semester, schoolYear, req.user.id, function (status, data, message, total, headers) {
      res.send({
        status: status,
        data: data,
        message: message,
        total: total,
        headers: headers,
      });
    });
  }else{
    model.createAdmin(req.body, req.user.id, function (status, data, message, total, headers) {
      res.send({
        status: status,
        data: data,
        message: message,
        total: total,
        headers: headers,
      });
    });
  }
  
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
  const studentId = req.query.studentId;
  const teacherId = req.query.teacherId;
  const schoolYear = req.query.schoolYear;
  const studentName = req.query.studentName;
  const semester = req.query.semester;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllAdmin(id, studentId, teacherId, schoolYear, studentName, req.user.id, semester, offset, limit, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};


exports.deleteTeacher = (req, res) => {
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

exports.createTeacher = (req, res) => {
  const classId = req.query.classId;
  const semester = req.query.semester;
  const schoolYear = req.query.schoolYear;
  if(classId){
    model.createListTeacher(classId, semester, schoolYear, req.user.id, function (status, data, message, total, headers) {
      res.send({
        status: status,
        data: data,
        message: message,
        total: total,
        headers: headers,
      });
    });
  }else{
    model.createTeacher(req.body, req.user.id, function (status, data, message, total, headers) {
      res.send({
        status: status,
        data: data,
        message: message,
        total: total,
        headers: headers,
      });
    });
  }
  
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
  const studentId = req.query.studentId;
  const teacherId = req.query.teacherId;
  const schoolYear = req.query.schoolYear;
  const studentName = req.query.studentName;
  const offset = req.query.offset;
  const limit = req.query.limit;
  model.getAllTeacher(id, studentId, teacherId, schoolYear, studentName, req.user.id, offset, limit, function (status, data, message, total, headers) {
    res.send({
      status: status,
      data: data,
      message: message,
      total: total,
      headers: headers,
    });
  });
};

