var MarkStudent = require("../models/MarkStudent");
var ContactBook = require("../models/ContactBook");
var Subject = require("../models/Subject");
var Cource = require("../models/Cources");
var Status = require("../common/core");
var School = require("../models/School");
var Teacher = require("../models/Teacher");
var ClassSC = require("../models/Class");
var Student = require("../models/Student");


var modelContactBook = new ContactBook();
var modelClass = new ClassSC();
var modelCource = new Cource();
var modelSchool = new School();
var modelStudent = new Student();
var modelTeacher = new Teacher();
var model = new MarkStudent();

module.exports = function () {
  // Kiểm tra dữ liệu
  function validator(markStudent) {
    if (!markStudent.contactBookId) {
      return "Bạn chưa nhập sổ liên lạc";
    }
    if (!markStudent.courceId) {
      return "Bạn chưa nhập môn học";
    }
    return null;
  }
  // Kiểm tra dữ liệu khóa ngoại
  const checkContactBookCource = async (contactBookId, courceId) => {
    try {
      // Kiểm tra khóa ngoại role có tồn tại
      if (contactBookId) {
        dataContactBook = await modelContactBook.getOne(contactBookId);
        if (dataContactBook.recordset.length == 0) {
          return "Không tìm thấy contact book tương ứng";
        }
      }

      // Kiểm tra khóa ngoại school có tồn tại
      if (courceId) {
        dataCource = await modelCource.getAllManager({ courceId: courceId });
        if (dataCource.recordset.length == 0) {
          return "Không tìm thấy cource tương ứng";
        }
      }

      if (contactBookId && courceId) {
        // Kiểm tra khóa ngoại school có tồn tại
        dataCheck = await model.checkExist(contactBookId, courceId);
        if (dataCheck.recordset.length != 0) {
          return "Đã tồn tại dữ liệu cho contactBookId = " + contactBookId;
        }
      }
    } catch (err) {
      return "Sai kiểu dữ liệu";
    }
    return null;
  };

  this.createOneManagerFromContactBook = async (studentId, teacherId, semester, schoolYear, className, classId) => {
    try {
      dataContactBookId = await modelContactBook.getAll({
        studentId: studentId, teacherId: teacherId,
        semester: semester, schoolYear: schoolYear, className: className
      });
      dataCourceFromClass = await modelCource.getAllManager({ classId: classId, yearId: schoolYear, semester: semester })

      markStudent = [];
      for (let index = 0; index < dataCourceFromClass.recordset.length; index++) {
        markStudent.push({
          contactBookId: dataContactBookId.recordset[0].id,
          courceId: dataCourceFromClass.recordset[index].idCources,
          mark: 0,
        });
      }
      await this.createOneManager(markStudent);
    } catch (err) {
      return "Sai kiểu dữ liệu";
    }
    return null;
  };

  this.createListAdminFromUpdateCources = async (classId, semester, schoolYear, userId, result) => {
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
        await this.createOneManagerFromContactBook(
          dataStudent.recordset[index].studentId,
          dataStudent.recordset[index].teacherId,
          semester,
          schoolYear,
          dataStudent.recordset[index].className,
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

  this.createListManagerFromUpdateCources = async (classId, semester, schoolYear, result) => {
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
        await this.createOneManagerFromContactBook(
          dataStudent.recordset[index].studentId,
          dataStudent.recordset[index].teacherId,
          semester,
          schoolYear,
          dataStudent.recordset[index].className,
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


  this.createOneManager = async (newData) => {
    try {
      for (let index = 0; index < newData.length; index++) {
        // Gán dữ liệu
        markStudent = {
          contactBookId: newData[index].contactBookId,
          courceId: newData[index].courceId,
          mark: 0,
        };

        // Yêu cầu nhập đầy đủ thông tin
        var validate = validator(markStudent);
        if (validate) {
          return false;
        }

        // Kiểm tra dữ liệu khóa ngoại roleId và schoolId có tồn tại
        var checkDataFK = await checkContactBookCource(
          markStudent.contactBookId,
          markStudent.courceId
        );
        if (checkDataFK != null) {
          continue;
        }

        // Thêm dữ liệu
        dataCreate = await model.create(markStudent);

        await modelContactBook.updateMark(markStudent.contactBookId);
      }
      //Status, Data,	Message, Total, Headers
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  this.createManager = async (newData, result) => {
    try {
      for (let index = 0; index < newData.length; index++) {
        // Gán dữ liệu
        markStudent = {
          contactBookId: newData[index].contactBookId,
          courceId: newData[index].courceId,
          mark: 0,
        };

        // Yêu cầu nhập đầy đủ thông tin
        var validate = validator(markStudent);
        if (validate) {
          return result(Status.APIStatus.Invalid, null, validate, 0, null);
        }

        // Kiểm tra dữ liệu khóa ngoại roleId và schoolId có tồn tại
        var checkDataFK = await checkContactBookCource(
          markStudent.contactBookId,
          markStudent.courceId
        );
        if (checkDataFK != null) {
          return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
        }

        // Thêm dữ liệu
        dataCreate = await model.create(markStudent);

        modelContactBook.updateMark(markStudent.contactBookId);
      }
      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Ok,
        null,
        "Tạo dữ liệu thành công",
        0,
        null
      );
    } catch (err) {
      console.log(err);
      return result(Status.APIStatus.Invalid, null, "Tạo thất bại", 0, null);
    }
  };

  this.createManagerBasic = async (newData, result) => {
    try {
      for (let index = 0; index < newData.length; index++) {
        // Gán dữ liệu
        markStudent = {
          contactBookId: newData[index].contactBookId,
          courceId: newData[index].courceId,
          mark: 0,
        };

        // Yêu cầu nhập đầy đủ thông tin
        var validate = validator(markStudent);
        if (validate) {
          return result(Status.APIStatus.Invalid, null, validate, 0, null);
        }

        // Kiểm tra dữ liệu khóa ngoại roleId và schoolId có tồn tại
        var checkDataFK = await checkContactBookCource(
          markStudent.contactBookId,
          markStudent.courceId
        );
        if (checkDataFK != null) {
          return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
        }

        // Thêm dữ liệu
        dataCreate = await model.create(markStudent);

        modelContactBook.updateMark(markStudent.contactBookId);
      }
      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Ok,
        null,
        "Tạo dữ liệu thành công",
        0,
        null
      );
    } catch (err) {
      console.log(err);
      return result(Status.APIStatus.Invalid, null, "Tạo thất bại", 0, null);
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

      // Kiểm tra dữ liệu khóa ngoại roleId và schoolId có tồn tại
      var checkDataFK = await checkContactBookCource(
        newData.contactBookId,
        newData.courceId
      );
      if (checkDataFK != null) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      // Gán giá trị cho dữ liệu
      markStudent = {
        id: newData.id,
        contactBookId: dataCheck.recordset[0].contactBookId || null,
        courceId: newData.courceId || dataCheck.recordset[0].courceId,
        mark: newData.mark || dataCheck.recordset[0].mark,
      };

      // Update dữ liệu
      dataUpdate = await model.update(markStudent);

      modelContactBook.updateMark(markStudent.contactBookId);

      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, markStudent, "Cập nhật thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, err, "Update failed", 0, null);
    }
  };

  this.getAllManager = async (id, contactBookId, studentId, schoolYear, courceId, offset, limit, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAll({
        contactBookId: contactBookId,
        studentId: studentId,
        schoolYear: schoolYear,
        markId: id,
        courceId: courceId,
        offset: offset,
        limit: limit
      });
      if (data.recordset.length === 0) {
        return result(
          Status.APIStatus.NotFound,
          null,
          "Không tìm thấy dữ liệu",
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
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, null, "Lấy dữ liệu thất bại", 0, null);
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
      dataDelete = await model.delete(id);
      modelContactBook.updateMark(dataCheck.recordset[0].contactBookId);

      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, null, "Xóa thành công", 0, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, null, "Xóa thất bại", 0, null);
    }
  };

  this.createAdmin = async (newData, userId, result) => {
    try {
      for (let index = 0; index < newData.length; index++) {
        // Gán dữ liệu
        markStudent = {
          contactBookId: newData[index].contactBookId,
          courceId: newData[index].courceId,
          mark: 0,
        };

        // Yêu cầu nhập đầy đủ thông tin
        var validate = validator(markStudent);
        if (validate) {
          return result(Status.APIStatus.Invalid, null, validate, 0, null);
        }

        // Kiểm tra dữ liệu khóa ngoại roleId và schoolId có tồn tại
        var checkDataFK = await checkContactBookCource(
          markStudent.contactBookId,
          markStudent.courceId
        );
        if (checkDataFK != null) {
          return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
        }

        schoolIdContactBook = await (await modelSchool.getSchoolIdFromContactBook({ contactBook: markStudent.contactBookId })).recordset[0].schoolId;
        schoolIdTeacher = await (await modelSchool.getSchoolIdFromTeacher({ userId: userId })).recordset[0].schoolId;
        if (
          schoolIdContactBook !== schoolIdTeacher
        ) {
          return result(Status.APIStatus.Invalid, null, "Lớp học được chọn không không thuộc quyền quản lý", 0, null);
        }

        // Thêm dữ liệu
        dataCreate = await model.create(markStudent);

        modelContactBook.updateMark(markStudent.contactBookId);
      }
      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Ok,
        null,
        "Tạo dữ liệu thành công",
        0,
        null
      );
    } catch (err) {
      console.log(err);
      return result(Status.APIStatus.Invalid, null, "Tạo thất bại", 0, null);
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

      // Kiểm tra dữ liệu khóa ngoại roleId và schoolId có tồn tại
      var checkDataFK = await checkContactBookCource(
        newData.contactBookId,
        newData.courceId
      );
      if (checkDataFK != null) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      // Gán giá trị cho dữ liệu
      markStudent = {
        id: newData.id,
        contactBookId: dataCheck.recordset[0].contactBookId || null,
        courceId: newData.courceId || dataCheck.recordset[0].courceId,
        mark: newData.mark || dataCheck.recordset[0].mark,
      };

      schoolIdContactBook = await (await modelSchool.getSchoolIdFromContactBook({ contactBook: markStudent.contactBookId })).recordset[0].schoolId;
      schoolIdTeacher = await (await modelSchool.getSchoolIdFromTeacher({ userId: userId })).recordset[0].schoolId;
      if (
        schoolIdContactBook !== schoolIdTeacher
      ) {
        return result(Status.APIStatus.Invalid, null, "Lớp học được chọn không không thuộc quyền quản lý", 0, null);
      }

      // Update dữ liệu
      dataUpdate = await model.update(markStudent);

      modelContactBook.updateMark(markStudent.contactBookId);

      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, markStudent, "Cập nhật thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, err, "Update failed", 0, null);
    }
  };

  this.getAllAdmin = async (id, contactBookId, studentId, userId, schoolYear, offset, limit, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllAdmin({
        contactBookId: contactBookId,
        studentId: studentId,
        userId: userId,
        schoolYear: schoolYear,
        markId: id,
        offset: offset,
        limit: limit
      });
      if (data.recordset.length === 0) {
        return result(
          Status.APIStatus.NotFound,
          null,
          "Không tìm thấy dữ liệu",
          0,
          null
        );
      }
      //Status, Data,	Message, Total, Headers
      result(
        Status.APIStatus.Ok,
        data.recordset,
        "Lấy dữ liệu thành công",
        data.recordset.length,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Lấy dữ liệu thất bại", 0, null);
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
      schoolIdContactBook = await (await modelSchool.getSchoolIdFromContactBook({ contactBook: dataCheck.recordset[0].contactBookId })).recordset[0].schoolId;
      schoolIdTeacher = await (await modelSchool.getSchoolIdFromTeacher({ userId: userId })).recordset[0].schoolId;
      if (
        schoolIdContactBook !== schoolIdTeacher
      ) {
        return result(Status.APIStatus.Invalid, null, "Lớp học được chọn không không thuộc quyền quản lý", 0, null);
      }
      dataDelete = await model.delete(id);
      modelContactBook.updateMark(dataCheck.recordset[0].contactBookId);

      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, null, "Xóa thành công", 0, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, null, "Xóa thất bại", 0, null);
    }
  };

  // this.updateTeacher = async (newData, userId, result) => {
  //   if (!newData?.id) {
  //     //Status, Data,	Message, Total, Headers
  //     return result(
  //       Status.APIStatus.Error,
  //       null,
  //       "Bạn chưa nhập đầy đủ thông tin",
  //       0,
  //       null
  //     );
  //   }
  //   try {
  //     // kiểm trả dữ liệu có tồn tại
  //     dataCheck = await model.getAllTeacher({ userId: userId, markId: newData.id });
  //     if (dataCheck.recordset.length === 0) {
  //       //Status, Data,	Message, Total, Headers
  //       return result(
  //         Status.APIStatus.NotFound,
  //         null,
  //         "Không tìm thấy dữ liệu tương ứng với id bằng " + newData.id,
  //         0,
  //         null
  //       );
  //     }

  //     // Gán giá trị cho dữ liệu
  //     markStudent = {
  //       id: newData.id,
  //       contactBookId: dataCheck.recordset[0].contactBookId,
  //       courceId: dataCheck.recordset[0].courceId,
  //       mark: newData.mark || dataCheck.recordset[0].mark,
  //     };
  //     // Update dữ liệu
  //     dataUpdate = await model.update(markStudent);
  //     modelContactBook.updateMark(markStudent.contactBookId);
  //     //Status, Data,	Message, Total, Headers
  //     result(Status.APIStatus.Ok, markStudent, "Cập nhật thành công", 1, null);
  //   } catch (err) {
  //     //Status, Data,	Message, Total, Headers
  //     result(Status.APIStatus.Error, err, "Update failed", 0, null);
  //   }
  // };

  this.updateTeacher = async (newData, userId, result) => {
    try {
      for (let index = 0; index < newData.length; index++) {
        // kiểm trả dữ liệu có tồn tại
        dataCheck = await model.getAllTeacher({ userId: userId, markId: newData[index].id });
        if (dataCheck.recordset.length === 0) {
          //Status, Data,	Message, Total, Headers
          return result(
            Status.APIStatus.NotFound,
            null,
            "Không tìm thấy dữ liệu tương ứng với id bằng " + newData[index].id,
            0,
            null
          );
        }
        // Gán giá trị cho dữ liệu
        markStudent = {
          id: newData[index].id,
          contactBookId: dataCheck.recordset[0].contactBookId,
          courceId: dataCheck.recordset[0].courceId,
          mark: newData[index].mark || dataCheck.recordset[0].mark,
        };
        // Update dữ liệu
        dataUpdate = await model.update(markStudent);
        modelContactBook.updateMark(markStudent.contactBookId);
      }
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Ok, null, "Cập nhật thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, err, "Update failed", 0, null);
    }
  };

  this.getAllTeacher = async (id, contactBookId, studentId, userId, schoolYear, semester, offset, limit, classId, courceId, studentIdFind, studentNameFind, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllTeacher({
        markId: id,
        contactBookId: contactBookId,
        studentId: studentId,
        userId: userId,
        schoolYear: schoolYear,
        semester: semester,
        offset: offset,
        limit: limit,
        classId: classId,
        courceId: courceId, 
        studentIdFind: studentIdFind, 
        studentNameFind: studentNameFind
      });
      if (data.recordset.length == 0) {
        return result(
          Status.APIStatus.NotFound,
          null,
          "Không tìm thấy dữ liệu",
          0,
          null
        );
      }
      //Status, Data,	Message, Total, Headers
      result(
        Status.APIStatus.Ok,
        data.recordset,
        "Lấy dữ liệu thành công",
        data.recordset.length,
        null
      );

    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Lấy dữ liệu không thành công", 0, null);
    }
  };

  this.getAllTeacherClass = async (userId, yearId, semester, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllTeacherClass({
        userId: userId,
        yearId: yearId,
        semester: semester
      });
      if (data.recordset.length == 0) {
        return result(
          Status.APIStatus.NotFound,
          null,
          "Không tìm thấy dữ liệu",
          0,
          null
        );
      }
      //Status, Data,	Message, Total, Headers
      result(
        Status.APIStatus.Ok,
        data.recordset,
        "Lấy dữ liệu thành công",
        data.recordset.length,
        null
      );

    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Lấy dữ liệu không thành công", 0, null);
    }
  };

  this.getAllHomeRoomTeacher = async (id, contactBookId, studentId, userId, schoolYear, semester, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllHomeRoomTeacher({
        markId: id,
        contactBookId: contactBookId,
        studentId: studentId,
        userId: userId,
        schoolYear: schoolYear,
        semester: semester
      });
      if (data.recordset.length == 0) {
        return result(
          Status.APIStatus.NotFound,
          null,
          "Không tìm thấy dữ liệu",
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

    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Lấy dữ liệu thất bại", 0, null);
    }
  };

  this.deleteTeacher = async (id, userId, result) => {
    try {
      // kiểm trả dữ liệu có tồn tại
      data = await model.getAllTeacher({
        markId: id
      });
      if (data.recordset.length == 0) {
        return result(
          Status.APIStatus.NotFound,
          null,
          "Không tìm thấy dữ liệu tương ứng với id bằng " + id,
          0,
          null
        );
      }
      dataDelete = await model.delete(id);
      modelContactBook.updateMark(dataCheck.recordset[0].contactBookId);

      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, null, "Xóa thành công", 0, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, null, "Xóa thất bại", 0, null);
    }
  };

  this.getAllStudent = async (id, contactBookId, userId, schoolYear, semester, offset, limit, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllStudent({
        contactBookId: contactBookId,
        studentId: userId,
        schoolYear: schoolYear,
        markId: id,
        semester: semester,
        offset: offset,
        limit: limit
      });
      if (data.recordset.length === 0) {
        return result(
          Status.APIStatus.NotFound,
          null,
          "Không tìm thấy dữ liệu",
          0,
          null
        );
      }
      //Status, Data,	Message, Total, Headers
      result(
        Status.APIStatus.Ok,
        data.recordset,
        "Lấy dữ liệu thành công",
        data.recordset.length,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Lấy dữ liệu thất bại", 0, null);
    }
  };

  this.getYearStudent = async (id, contactBookId, userId, schoolYear, offset, limit, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getYearStudent({
        contactBookId: contactBookId,
        studentId: userId,
        schoolYear: schoolYear,
        markId: id,
        offset: offset,
        limit: limit
      });
      if (data.recordset.length === 0) {
        return result(
          Status.APIStatus.NotFound,
          null,
          "Không tìm thấy dữ liệu",
          0,
          null
        );
      }
      //Status, Data,	Message, Total, Headers
      result(
        Status.APIStatus.Ok,
        data.recordset,
        "Lấy dữ liệu thành công",
        data.recordset.length,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Lấy dữ liệu thất bại", 0, null);
    }
  };

  this.getMarkCourceStudent = async (id, contactBookId, userId, schoolYear, offset, limit, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getMarkCourceStudent({
        contactBookId: contactBookId,
        studentId: userId,
        schoolYear: schoolYear,
        markId: id,
        offset: offset,
        limit: limit
      });
      if (data.recordset.length === 0) {
        return result(
          Status.APIStatus.NotFound,
          null,
          "Không tìm thấy dữ liệu",
          0,
          null
        );
      }
      //Status, Data,	Message, Total, Headers
      result(
        Status.APIStatus.Ok,
        data.recordset,
        "Lấy dữ liệu thành công",
        data.recordset.length,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Lấy dữ liệu thất bại", 0, null);
    }
  };

  this.getAllFamily = async (id, contactBookId, userId, schoolYear, studentId, offset, limit, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllFamily({
        contactBookId: contactBookId,
        familyId: userId,
        schoolYear: schoolYear,
        markId: id,
        studentId: studentId,
        offset: offset,
        limit: limit
      });
      if (data.recordset.length === 0) {
        return result(
          Status.APIStatus.NotFound,
          null,
          "Không tìm thấy dữ liệu",
          0,
          null
        );
      }
      //Status, Data,	Message, Total, Headers
      result(
        Status.APIStatus.Ok,
        data.recordset,
        "Lấy dữ liệu thành công",
        data.recordset.length,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Lấy dữ liệu thất bại", 0, null);
    }
  };

  this.getYearFamily = async (id, contactBookId, userId, schoolYear, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getYearFamily({
        contactBookId: contactBookId,
        studentId: userId,
        schoolYear: schoolYear,
        markId: id
      });
      if (data.recordset.length === 0) {
        return result(
          Status.APIStatus.NotFound,
          null,
          "Không tìm thấy dữ liệu",
          0,
          null
        );
      }
      //Status, Data,	Message, Total, Headers
      result(
        Status.APIStatus.Ok,
        data.recordset,
        "Lấy dữ liệu thành công",
        data.recordset.length,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Lấy dữ liệu thất bại", 0, null);
    }
  };
};
