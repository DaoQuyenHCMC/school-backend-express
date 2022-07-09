var ContactBook = require("../models/ContactBook");
var Teacher = require("../models/Teacher");
var ClassSC = require("../models/Class");
var Student = require("../models/Student");
var Status = require("../common/core");
var Year = require("../models/Year");
var School = require("../models/School");
var Cources = require("../models/Cources");

var model = new ContactBook();
var modelYear = new Year();
var modelClass = new ClassSC();
var modelStudent = new Student();
var modelTeacher = new Teacher();
var modelSchool = new School();
var modelCource = new Cources();


var MarkStudent = require("../service/MarkStudentService");

var modelServiceMarkStudent = new MarkStudent();
module.exports = function () {
  function validator(studentId, semester, schoolYear) {
    if (!studentId || !semester || !schoolYear) {
      return "Bạn chưa nhập thông tin đầy đủ";
    }

    if (!(schoolYear % 1 === 0)) {
      return "Sai kiểu dữ liệu của year";
    }

    if (!(semester === "HK I" || semester === "HK II")) {
      //Status, Data,	Message, Total, Headers
      return "Sai học kỳ";
    }
    return null;
  }

  // Kiểm tra dữ liệu khóa ngoại
  const checkStudentTeacher = async (studentId, schoolYear) => {
    try {
      // Kiểm tra khóa ngoại studentId có tồn tại
      dataStudent = await modelStudent.getOne(studentId);
      if (dataStudent.recordset.length == 0) {
        return "Không tìm thấy student tương ứng";
      }

      // Kiểm tra khóa ngoại studentId có tồn tại
      dataYear = await modelYear.getOne(schoolYear);
      if (dataYear.recordset.length == 0) {
        return "Không tìm thấy year tương ứng";
      }
    } catch (err) {
      return "Sai kiểu dữ liệu";
    }
    return null;
  };

  this.getAllStudent = async (id, userId, semester, schoolYear, offset, limit, result) => {
    try {
      if (id) {
        // Lấy tất cả dữ liệu
        data = await model.getOne(id);

        if (data.recordset.length == 0) {
          return result(
            Status.APIStatus.NotFound,
            null,
            "Không tìm thấy dữ liệu tương ứng với id bằng " + id,
            0,
            null
          );
        }
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Ok,
          data.recordset,
          "Lấy dữ liệu thành công",
          data.recordset.length,
          null
        );
      }
      if (!id) {
        // Lấy tất cả dữ liệu
        data = await model.getAll({
          studentId: userId,
          schoolYear: schoolYear,
          semester: semester,
          offset: offset,
          limit: limit
        });
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Ok,
          data.recordset,
          "Lấy dữ liệu thành công",
          data.recordset.length,
          null
        );
      }
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Error,
        err,
        "Lấy dữ liệu thất bại",
        0,
        null
      );
    }
  };

  this.createListManager = async (classId, semester, schoolYear, result) => {
    try {
      if (!semester || !(semester === "HK I" || semester === "HK II")) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Invalid,
          null,
          "Thiếu hoặc sai học kỳ",
          0,
          null
        );
      }

      if (!schoolYear || !(schoolYear % 1 === 0)) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Invalid,
          null,
          "Thiếu hoặc sai year",
          0,
          null
        );
      }


      dataStudent = await modelStudent.getIdClassNameTeacherId({
        classId: classId,
      });
      if (dataStudent.recordset.length === 0) {
        //Status, Data,	Message, Total, Headers
        return result(Status.APIStatus.Ok, null, "Danh sách rỗng", 0, null);
      }

      for (let index = 0; index < dataStudent.recordset.length; index++) {
        contactBook = {
          studentId: dataStudent.recordset[index].studentId || null,
          teacherId: dataStudent.recordset[index].teacherId || null,
          schoolYear: schoolYear,
          semester: semester,
          className: dataStudent.recordset[index].className || null,
          mark: 0,
        };

        dataCheck = await model.checkExisted(contactBook);
        if (dataCheck.recordset.length != 0) {
          continue;
        }

        // Thêm dữ liệu
        dataCreate = await model.create(contactBook);

        await modelServiceMarkStudent.createOneManagerFromContactBook(contactBook.studentId,
          contactBook.teacherId,
          contactBook.semester,
          contactBook.schoolYear,
          contactBook.className,
          dataStudent.recordset[index].classId);
      }

      return result(
        Status.APIStatus.Ok,
        null,
        "Tạo dữ liệu thành công",
        0,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Error,
        null,
        "Tạo dữ liệu thất bại",
        0,
        null
      );
    }
  };

  this.createManager = async (newData, result) => {
    // Gán dữ liệu
    contactBook = {
      studentId: newData.studentId || null,
      schoolYear: newData.schoolYear || null,
      teacherId: null,
      semester: newData.semester || null,
      className: null,
      mark: 0,
    };

    try {
      var validate = validator(
        contactBook.studentId,
        contactBook.semester,
        contactBook.schoolYear
      );
      if (validate != null) {
        return result(Status.APIStatus.Invalid, null, validate, 0, null);
      }

      // Kiểm tra dữ liệu khóa ngoại  có tồn tại
      var checkDataFK = await checkStudentTeacher(
        contactBook.studentId,
        contactBook.schoolYear
      );
      if (checkDataFK != null) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      // Lấy tên lớp
      dataClass = await modelClass.getNameClassByStudentId(
        contactBook.studentId
      );
      if (dataClass.recordset.length == 0) {
        return result(Status.APIStatus.NotFound, null, null, 0, null);
      }
      contactBook.className = dataClass.recordset[0].name;

      // Lấy teacherId
      dataTeacher = await modelTeacher.getIdNameTeacherByClassId(
        dataClass.recordset[0].id
      );
      if (dataTeacher.recordset.length == 0) {
        //Status, Data,	Message, Total, Headers
        return result(Status.APIStatus.Invalid, null, "Lớp hiện chưa có giáo viên", 0, null);
      }
      contactBook.teacherId = dataTeacher.recordset[0].id;

      dataCheck = await model.checkExisted(contactBook);
      if (dataCheck.recordset.length != 0) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Existed,
          null,
          "Học sinh đã tồn tại sổ liên lạc",
          0,
          null
        );
      }

      // Thêm dữ liệu
      dataCreate = await model.create(contactBook);
      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Ok,
        contactBook,
        "Tạo dữ liệu thành công",
        0,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Error,
        null,
        "Tạo dữ liệu thất bại",
        0,
        null
      );
    }
  };

  this.updateManager = async (newData, result) => {
    if (!newData?.id) {
      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Error,
        null,
        "Bạn chưa nhập đầy đủ thông tin",
        0,
        null
      );
    }
    try {
      // kiểm trả dữ liệu có tồn tại
      dataCheck = await model.getOne(newData.id);
      if (dataCheck.recordset.length === 0) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.NotFound,
          null,
          "Không tìm thấy dữ liệu tương ứng với id bằng " + newData.id,
          0,
          null
        );
      }

      // Gán giá trị cho dữ liệu
      contactBook = {
        id: newData.id,
        studentId: newData.studentId || dataCheck.recordset[0].studentId,
        teacherId: newData.teacherId || dataCheck.recordset[0].teacherId,
        semester: newData.semester || dataCheck.recordset[0].semester,
        className: newData.className || dataCheck.recordset[0].className,
        schoolYear: newData.schoolYear || dataCheck.recordset[0].schoolYear,
        mark: dataCheck.recordset[0].mark,
      };

      // Kiểm tra dữ liệu khóa ngoại  có tồn tại
      var checkDataFK = await checkStudentTeacher(
        contactBook.studentId,
        contactBook.schoolYear
      );
      if (checkDataFK != null) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      // Update dữ liệu
      dataUpdate = await model.update(contactBook);
      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Ok,
        contactBook,
        "Cập nhật thành công",
        1,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, err, "Update failed", 0, null);
    }
  };

  this.getAllManager = async (id, studentId, teacherId, schoolYear, studentName, semester, offset, limit, result) => {
    try {
      if (id) {
        // Lấy tất cả dữ liệu
        data = await model.getOne(id);

        if (data.recordset.length == 0) {
          return result(
            Status.APIStatus.NotFound,
            null,
            "Không tìm thấy dữ liệu tương ứng với id bằng " + id,
            0,
            null
          );
        }
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Ok,
          data.recordset,
          "Lấy dữ liệu thành công",
          data.recordset.length,
          null
        );
      }
      if (!id) {
        // Lấy tất cả dữ liệu
        data = await model.getAll({
          studentId: studentId,
          teacherId: teacherId,
          schoolYear: schoolYear,
          studentName: studentName,
          semester: semester,
          offset: offset,
          limit: limit
        });
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Ok,
          data.recordset,
          "Lấy dữ liệu thành công",
          data.recordset.length,
          null
        );
      }
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Error,
        err,
        "Lấy dữ liệu thất bại",
        0,
        null
      );
    }
  };

  this.deleteManager = async (id, result) => {
    try {
      // kiểm trả dữ liệu có tồn tại
      dataCheck = await model.getOne(id);
      if (dataCheck.recordset.length === 0) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.NotFound,
          null,
          "Không tìm thấy dữ liệu tương ứng với id bằng " + id,
          0,
          null
        );
      }

      // xóa dữ liệu
      dataDelete = await model.delete(id);

      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, null, "Xóa thành công", 0, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, null, "Xóa thất bại", 0, null);
    }
  };

  this.createListAdmin = async (classId, semester, schoolYear, userId, result) => {
    try {
      if (!semester || !(semester === "HK I" || semester === "HK II")) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Invalid,
          null,
          "Thiếu hoặc sai học kỳ",
          0,
          null
        );
      }

      if (!schoolYear || !(schoolYear % 1 === 0)) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Invalid,
          null,
          "Thiếu hoặc sai year",
          0,
          null
        );
      }

      schoolIdClass = await (await modelClass.getIdSchoolFromIdClass({ classId: classId })).recordset[0].schoolId;
      schoolIdTeacher = await (await modelSchool.getSchoolIdFromTeacher({ userId: userId })).recordset[0].schoolId;
      if (
        schoolIdClass !== schoolIdTeacher
      ) {
        return result(Status.APIStatus.Invalid, null, "Lớp học được chọn không không thuộc quyền quản lý", 0, null);
      }

      dataStudent = await modelStudent.getIdClassNameTeacherId({
        classId: classId,
      });
      if (dataStudent.recordset.length === 0) {
        //Status, Data,	Message, Total, Headers
        return result(Status.APIStatus.Ok, null, "Danh sách rỗng", 0, null);
      }

      for (let index = 0; index < dataStudent.recordset.length; index++) {
        contactBook = {
          studentId: dataStudent.recordset[index].studentId || null,
          teacherId: dataStudent.recordset[index].teacherId || null,
          schoolYear: schoolYear,
          semester: semester,
          className: dataStudent.recordset[index].className || null,
          mark: 0,
        };

        dataCheck = await model.checkExisted(contactBook);
        if (dataCheck.recordset.length != 0) {
          continue;
        }
        // Thêm dữ liệu
        dataCreate = await model.create(contactBook);

        await modelServiceMarkStudent.createOneManagerFromContactBook(contactBook.studentId,
          contactBook.teacherId,
          contactBook.semester,
          contactBook.schoolYear,
          contactBook.className,
          dataStudent.recordset[index].classId);
      }
      return result(
        Status.APIStatus.Ok,
        null,
        "Tạo dữ liệu thành công",
        0,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Error,
        null,
        "Tạo dữ liệu thất bại",
        0,
        null
      );
    }
  };

  this.createAdmin = async (newData, userId, result) => {
    // Gán dữ liệu
    contactBook = {
      studentId: newData.studentId || null,
      schoolYear: newData.schoolYear || null,
      teacherId: null,
      semester: newData.semester || null,
      className: null,
      mark: 0,
    };

    try {
      var validate = validator(
        contactBook.studentId,
        contactBook.semester,
        contactBook.schoolYear
      );
      if (validate != null) {
        return result(Status.APIStatus.Invalid, null, validate, 0, null);
      }

      schoolIdTeacherFromContactBook = await (await modelSchool.getSchoolIdFromTeacher({ userId: userId })).recordset[0].schoolId;
      schoolIdStudentFromContactBook = await (await modelSchool.getSchoolIdFromStudent({ studentId: contactBook.studentId })).recordset[0].schoolId;
      if (
        schoolIdTeacherFromContactBook !== schoolIdStudentFromContactBook
      ) {
        return result(Status.APIStatus.Invalid, null, "Học sinh không thuộc quyền quản lý", 0, null);
      }

      // Kiểm tra dữ liệu khóa ngoại  có tồn tại
      var checkDataFK = await checkStudentTeacher(
        contactBook.studentId,
        contactBook.schoolYear
      );
      if (checkDataFK != null) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      // Lấy tên lớp
      dataClass = await modelClass.getNameClassByStudentId(
        contactBook.studentId
      );
      if (dataClass.recordset.length == 0) {
        return result(Status.APIStatus.NotFound, null, null, 0, null);
      }
      contactBook.className = dataClass.recordset[0].name;

      // Lấy teacherId
      dataTeacher = await modelTeacher.getIdNameTeacherByClassId(
        dataClass.recordset[0].id
      );
      if (dataTeacher.recordset.length == 0) {
        //Status, Data,	Message, Total, Headers
        return result(Status.APIStatus.Invalid, null, "Lớp hiện chưa có giáo viên", 0, null);
      }
      contactBook.teacherId = dataTeacher.recordset[0].id;

      dataCheck = await model.checkExisted(contactBook);
      if (dataCheck.recordset.length != 0) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Existed,
          null,
          "Học sinh đã tồn tại sổ liên lạc",
          0,
          null
        );
      }

      // Thêm dữ liệu
      dataCreate = await model.create(contactBook);
      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Ok,
        contactBook,
        "Tạo dữ liệu thành công",
        0,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Error,
        null,
        "Tạo dữ liệu thất bại",
        0,
        null
      );
    }
  };

  this.updateAdmin = async (newData, userId, result) => {
    if (!newData?.id) {
      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Error,
        null,
        "Bạn chưa nhập đầy đủ thông tin",
        0,
        null
      );
    }
    try {
      // kiểm trả dữ liệu có tồn tại
      dataCheck = await model.getOne(newData.id);
      if (dataCheck.recordset.length === 0) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.NotFound,
          null,
          "Không tìm thấy dữ liệu tương ứng với id bằng " + newData.id,
          0,
          null
        );
      }

      // Gán giá trị cho dữ liệu
      contactBook = {
        id: newData.id,
        studentId: newData.studentId || dataCheck.recordset[0].studentId,
        teacherId: newData.teacherId || dataCheck.recordset[0].teacherId,
        semester: newData.semester || dataCheck.recordset[0].semester,
        className: newData.className || dataCheck.recordset[0].className,
        schoolYear: newData.schoolYear || dataCheck.recordset[0].schoolYear,
        mark: dataCheck.recordset[0].mark,
      };

      // Kiểm tra dữ liệu khóa ngoại  có tồn tại
      var checkDataFK = await checkStudentTeacher(
        contactBook.studentId,
        contactBook.schoolYear
      );
      if (checkDataFK != null) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      // Update dữ liệu
      dataUpdate = await model.update(contactBook);
      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Ok,
        contactBook,
        "Cập nhật thành công",
        1,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, err, "Cập nhật dữ liệu thất bại", 0, null);
    }
  };

  this.getAllAdmin = async (id, studentId, teacherId, schoolYear, studentName, userId, semester, offset, limit, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllAdmin({
        studentId: studentId,
        teacherId: teacherId,
        schoolYear: schoolYear,
        studentName: studentName,
        contactBookId: id,
        userId: userId,
        semester: semester,
        offset: offset,
        limit: limit
      });
      if (data.recordset.length === 0) {
        return result(
          Status.APIStatus.NotFound,
          data.recordset,
          "Không tìm thấy dữ liệu",
          data.recordset.length,
          null
        );
      }
      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Ok,
        data.recordset,
        "Lấy dữ liệu thành công",
        data.recordset.length,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Error,
        err,
        "Lấy dữ liệu thất bại",
        0,
        null
      );
    }
  };

  this.deleteAdmin = async (id, userId, result) => {
    try {
      // kiểm trả dữ liệu có tồn tại
      dataCheck = await model.getOne(id);
      if (dataCheck.recordset.length === 0) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.NotFound,
          null,
          "Không tìm thấy dữ liệu tương ứng với id bằng " + id,
          0,
          null
        );
      }

      schoolIdTeacherFromContactBook = await (await modelSchool.getSchoolIdFromTeacher({ userId: userId })).recordset[0].schoolId;
      schoolIdStudentFromContactBook = await (await modelSchool.getSchoolIdFromStudent({ studentId: dataCheck.recordset[0].studentId })).recordset[0].schoolId;
      if (
        schoolIdTeacherFromContactBook !== schoolIdStudentFromContactBook
      ) {
        return result(Status.APIStatus.Invalid, null, "Học sinh không thuộc quyền quản lý", 0, null);
      }


      // xóa dữ liệu
      dataDelete = await model.delete(id);

      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, null, "Xóa thành công", 0, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, null, "Xóa thất bại", 0, null);
    }
  };

  this.createTeacher = async (newData, userId, result) => {
    // Gán dữ liệu
    contactBook = {
      studentId: newData.studentId || null,
      schoolYear: newData.schoolYear || null,
      teacherId: null,
      semester: newData.semester || null,
      className: null,
      mark: 0,
    };

    try {
      var validate = validator(
        contactBook.studentId,
        contactBook.semester,
        contactBook.schoolYear
      );
      if (validate != null) {
        return result(Status.APIStatus.Invalid, null, validate, 0, null);
      }

      schoolIdTeacherFromContactBook = await (await modelSchool.getSchoolIdFromTeacher({ userId: userId })).recordset[0].schoolId;
      schoolIdStudentFromContactBook = await (await modelSchool.getSchoolIdFromStudent({ studentId: contactBook.studentId })).recordset[0].schoolId;
      if (
        schoolIdTeacherFromContactBook !== schoolIdStudentFromContactBook
      ) {
        return result(Status.APIStatus.Invalid, null, "Học sinh không thuộc quyền quản lý", 0, null);
      }

      // Kiểm tra dữ liệu khóa ngoại  có tồn tại
      var checkDataFK = await checkStudentTeacher(
        contactBook.studentId,
        contactBook.schoolYear
      );
      if (checkDataFK != null) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      // Lấy tên lớp
      dataClass = await modelClass.getNameClassByStudentId(
        contactBook.studentId
      );
      if (dataClass.recordset.length == 0) {
        return result(Status.APIStatus.NotFound, null, null, 0, null);
      }
      contactBook.className = dataClass.recordset[0].name;

      // Lấy teacherId
      dataTeacher = await modelTeacher.getIdNameTeacherByClassId(
        dataClass.recordset[0].id
      );
      if (dataTeacher.recordset.length == 0) {
        //Status, Data,	Message, Total, Headers
        return result(Status.APIStatus.Invalid, null, "Lớp hiện chưa có giáo viên", 0, null);
      }
      contactBook.teacherId = dataTeacher.recordset[0].id;

      dataCheck = await model.checkExisted(contactBook);
      if (dataCheck.recordset.length != 0) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Existed,
          null,
          "Học sinh đã tồn tại sổ liên lạc",
          0,
          null
        );
      }

      // Thêm dữ liệu
      dataCreate = await model.create(contactBook);
      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Ok,
        contactBook,
        "Tạo dữ liệu thành công",
        0,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Error,
        null,
        "Tạo dữ liệu thất bại",
        0,
        null
      );
    }
  };

  this.updateTeacher = async (newData, userId, result) => {
    if (!newData?.id) {
      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Error,
        null,
        "Bạn chưa nhập đầy đủ thông tin",
        0,
        null
      );
    }
    try {
      // kiểm trả dữ liệu có tồn tại
      dataCheck = await model.getOne(newData.id);
      if (dataCheck.recordset.length === 0) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.NotFound,
          null,
          "Không tìm thấy dữ liệu tương ứng với id bằng " + newData.id,
          0,
          null
        );
      }

      // Gán giá trị cho dữ liệu
      contactBook = {
        id: newData.id,
        studentId: newData.studentId || dataCheck.recordset[0].studentId,
        teacherId: newData.teacherId || dataCheck.recordset[0].teacherId,
        semester: newData.semester || dataCheck.recordset[0].semester,
        className: newData.className || dataCheck.recordset[0].className,
        schoolYear: newData.schoolYear || dataCheck.recordset[0].schoolYear,
        mark: dataCheck.recordset[0].mark,
      };

      // Kiểm tra dữ liệu khóa ngoại  có tồn tại
      var checkDataFK = await checkStudentTeacher(
        contactBook.studentId,
        contactBook.schoolYear
      );
      if (checkDataFK != null) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      // Update dữ liệu
      dataUpdate = await model.update(contactBook);
      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Ok,
        contactBook,
        "Cập nhật dữ liệu thành công",
        1,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, err, "Cập nhật dữ liệu thất bại", 0, null);
    }
  };

  this.getAllTeacher = async (id, studentId, teacherId, schoolYear, studentName, userId, offset, limit, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllAdmin({
        studentId: studentId,
        teacherId: userId,
        schoolYear: schoolYear,
        studentName: studentName,
        contactBookId: id,
        userId: userId,
        offset: offset,
        limit: limit
      });
      if (data.recordset.length === 0) {
        return result(
          Status.APIStatus.NotFound,
          data.recordset,
          "Không tìm thấy dữ liệu",
          data.recordset.length,
          null
        );
      }
      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Ok,
        data.recordset,
        "Lấy dữ liệu thành công",
        data.recordset.length,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Error,
        err,
        "Lấy dữ liệu thất bại",
        0,
        null
      );
    }
  };

  this.deleteTeacher = async (id, userId, result) => {
    try {
      // kiểm trả dữ liệu có tồn tại
      dataCheck = await model.getOne(id);
      if (dataCheck.recordset.length === 0) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.NotFound,
          null,
          "Không tìm thấy dữ liệu tương ứng với id bằng " + id,
          0,
          null
        );
      }

      schoolIdTeacherFromContactBook = await (await modelSchool.getSchoolIdFromTeacher({ userId: userId })).recordset[0].schoolId;
      schoolIdStudentFromContactBook = await (await modelSchool.getSchoolIdFromStudent({ studentId: dataCheck.recordset[0].studentId })).recordset[0].schoolId;
      if (
        schoolIdTeacherFromContactBook !== schoolIdStudentFromContactBook
      ) {
        return result(Status.APIStatus.Invalid, null, "Học sinh không thuộc quyền quản lý", 0, null);
      }


      // xóa dữ liệu
      dataDelete = await model.delete(id);

      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, null, "Xóa thành công", 0, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, null, "Xóa thất bại", 0, null);
    }
  };

  this.createListTeacher = async (classId, semester, schoolYear, userId, result) => {
    try {
      if (!semester || !(semester === "HK I" || semester === "HK II")) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Invalid,
          null,
          "Thiếu hoặc sai học kỳ",
          0,
          null
        );
      }

      if (!schoolYear || !(schoolYear % 1 === 0)) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Invalid,
          null,
          "Thiếu hoặc sai year",
          0,
          null
        );
      }

      schoolIdClass = await (await modelClass.getIdSchoolFromIdClass({ classId: classId })).recordset[0].schoolId;
      schoolIdTeacher = await (await modelSchool.getSchoolIdFromTeacher({ userId: userId })).recordset[0].schoolId;
      if (
        schoolIdClass !== schoolIdTeacher
      ) {
        return result(Status.APIStatus.Invalid, null, "Lớp học được chọn không không thuộc quyền quản lý", 0, null);
      }

      dataStudent = await modelStudent.getIdClassNameTeacherId({
        classId: classId,
      });
      if (dataStudent.recordset.length === 0) {
        //Status, Data,	Message, Total, Headers
        return result(Status.APIStatus.Ok, null, "Danh sách rỗng", 0, null);
      }

      for (let index = 0; index < dataStudent.recordset.length; index++) {
        contactBook = {
          studentId: dataStudent.recordset[index].studentId || null,
          teacherId: dataStudent.recordset[index].teacherId || null,
          schoolYear: schoolYear,
          semester: semester,
          className: dataStudent.recordset[index].className || null,
          mark: 0,
        };

        dataCheck = await model.checkExisted(contactBook);
        if (dataCheck.recordset.length != 0) {
          continue;
        }

        // Thêm dữ liệu
        dataCreate = await model.create(contactBook);
      }

      return result(
        Status.APIStatus.Ok,
        null,
        "Tạo dữ liệu thành công",
        0,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Error,
        null,
        "Tạo dữ liệu thất bại",
        0,
        null
      );
    }
  };
};
