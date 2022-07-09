var Status = require("../common/core");
const bcrypt = require("bcryptjs");

var Auth = require("../models/Auth");
var Student = require("../models/Student");
var ClassSC = require("../models/Class");
var Teacher = require("../models/Teacher");
var Family = require("../models/Family");
var School = require("../models/School");
const { id } = require("tedious/lib/data-types/null");

var modelAuth = new Auth();
var modelFamily = new Family();
var model = new Student();
var modelClass = new ClassSC();
var modelTeacher = new Teacher();
var modelSchool = new School();

module.exports = function () {
  // Kiểm tra dữ liệu
  function validator(student) {
    if (!student.id || !student.schoolId || !student.classId) {
      return "Bạn chưa nhập đầy đủ thông tin: trường, lớp học, định danh";
    }
    return null;
  }

  // Kiểm tra dữ liệu khóa chính
  const checkStudent = async (id, email) => {
    try {
      data = await model.getOne(id);
      if (data.recordset.length !== 0) {
        return data.recordset[0];
      }


      dataCheckEmail = await model.checkEmail(email);
      if (dataCheckEmail.recordset.length !== 0) {
        return dataCheckEmail.recordset[0];
      }
    } catch (err) {
      console.log(err);
    }
    return null;
  };

  // Kiểm tra dữ liệu khóa ngoại
  const checkClassAndCheckRole = async (
    classId,
    studentId,
    email,
    cmndFamily
  ) => {
    try {
      // Kiểm tra khóa ngoại school có tồn tại
      if (classId) {
        dataClass = await modelClass.getOne(classId);
        if (dataClass.recordset.length == 0) {
          return "Không tìm thấy class tương ứng";
        }
      }

      // Kiểm tra tên tài khoản có trùng với teacher
      if (studentId) {
        dataTeacher = await modelTeacher.getOne(studentId);
        if (dataTeacher.recordset.length != 0) {
          return "Đã tồn tại tên tài khoản";
        }

        dataCheckEmail = await modelTeacher.checkEmail(email);
        if (dataCheckEmail.recordset.length !== 0) {
          return "Email đã được sử dụng";
        }

        dataCheckEmailfamily = await modelFamily.checkEmail(email);
        if (dataCheckEmailfamily.recordset.length !== 0) {
          return "Email đã được sử dụng";
        }
      }

      if (cmndFamily) {
        dataFamily = await modelFamily.getOne(cmndFamily);
        if (dataFamily.recordset.length === 0) {
          return "Không tồn tại cmnd của gia đình tương ứng";
        }
      }
    } catch (err) {
      return "Sai kiểu dữ liệu";
    }
    return null;
  };

  const checkStudentEmail = async (email) => {
    try {
      if (email) {
        dataCheckEmail = await model.checkEmail(email);
        if (dataCheckEmail.recordset.length !== 0) {
          return "Email đã được sử dụng";
        }
      }
    } catch (err) {
      return "Lỗi"
    }
    return null;
  };

  // Thêm
  this.createManager = async (userId, newData, result) => {
    // Gán dữ liệu
    student = {
      id: newData.id,
      classId: newData.classId,
      name: newData.name,
      phone: newData.phone,
      email: newData.email,
      password: newData.id,
      address: newData.address,
      status: newData.status ? 1 : 1,
      cmndFamily: newData.cmndFamily,
      schoolId: newData.schoolId,
      createBy: userId,
      updateBy: userId,
    };

    try {
      // Yêu cầu nhập đầy đủ thông tin
      var validate = validator(student);
      if (validate) {
        return result(Status.APIStatus.Invalid, null, validate, 0, null);
      }

      // kiểm trả dữ liệu có tồn tại
      var checkDataPK = await checkStudent(student.id, student.email);
      if (checkDataPK) {
        return result(
          Status.APIStatus.Invalid,
          null,
          "Đã tồn tại tài khoản hoặc email",
          0,
          null
        );
      }

      // Kiểm tra dữ liệu khóa ngoại roleId và classId có tồn tại
      var checkDataFK = await checkClassAndCheckRole(
        student.classId,
        student.id,
        student.email,
        student.cmndFamily
      );
      if (checkDataFK) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      schoolId = await (await modelClass.getIdSchoolFromIdClass({ classId: student.classId })).recordset[0].schoolId;
      if (
        schoolId !== student.schoolId
      ) {
        return result(Status.APIStatus.Invalid, null, "Học sinh và lớp được chọn không cùng trường", 0, null);
      }

      // Mã hóa mật khẩu
      student.password = await bcrypt.hash(student.password, 10);

      // Thêm dữ liệu
      dataCreate = await model.create(student);

      if (student.classId) {
        await modelClass.updateTotal(student.classId);
      }

      if (newData.classId) {
        await modelClass.updateTotal(newData.classId);
      }

      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Ok,
        student,
        "Tạo dữ liệu thành công",
        1,
        null
      );
    } catch (err) {
      console.log(err);
      //Status, Data, Token,	Message, Total, Headers
      return result(
        Status.APIStatus.Error,
        null,
        "Tạo dữ liệu thất bại",
        0,
        null
      );
    }
  };

  this.updateManager = async (userId, newData, result) => {
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
      var dataCheck = await checkStudent(newData.id, null);
      if (dataCheck == null) {
        return result(
          Status.APIStatus.Invalid,
          null,
          "Không tồn tại dữ liệu",
          0,
          null
        );
      }

      // Gán giá trị cho dữ liệu
      student = {
        id: newData.id,
        classId: newData.classId || dataCheck.classId,
        name: newData.name || dataCheck.name,
        phone: newData.phone || dataCheck.phone,
        email: newData.email || dataCheck.email,
        password: null,
        cmndFamily: newData.cmndFamily || dataCheck.cmndFamily,
        address: newData.address || dataCheck.address,
        status: newData.status || dataCheck.status,
        schoolId: newData.schoolId || dataCheck.schoolId,
        updateBy: userId,
      };

      // Kiểm tra cho email trong bảng student
      if (newData.email !== dataCheck.email) email = newData.email;
      // kiểm trả dữ liệu có tồn tại
      var checkEmail = await checkStudentEmail(email);
      if (checkEmail) {
        return result(
          Status.APIStatus.Invalid,
          null,
          checkEmail,
          0,
          null
        );
      }

      // Kiểm tra dữ liệu khóa ngoại và email với bảng teacher có tồn tại
      var checkDataFK = await checkClassAndCheckRole(
        student.classId,
        student.id,
        student.email,
        student.cmndFamily
      );
      if (checkDataFK) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      schoolId = await (await modelClass.getIdSchoolFromIdClass({ classId: student.classId })).recordset[0].schoolId;
      if (
        schoolId !== student.schoolId
      ) {
        return result(Status.APIStatus.Invalid, null, "Học sinh và lớp được chọn không cùng trường", 0, null);
      }

      if (newData.password) {
        if (newData.password.length < 6) {
          //Status, Data,	Message, Total, Headers
          return result(
            Status.APIStatus.Error,
            null,
            "Độ dài mật khẩu yêu cầu tối thiểu 6 ký tự",
            0,
            null
          );
        }
        // Mã hóa mật khẩu
        student.password = await bcrypt.hash(newData.password, 10);
      } else {
        // lấy mật khẩu cho học sinh
        dataStudent = await modelAuth.loginStudent(student.id);
        if (
          dataStudent.recordset.length !== 0 &&
          dataStudent.recordset[0].password
        ) {
          student.password = dataStudent.recordset[0].password;
        }
      }

      // Update dữ liệu
      dataUpdate = await model.update(student);

      if (student.classId) {
        await modelClass.updateTotal(student.classId);
      }

      if (dataCheck.classId) {
        await modelClass.updateTotal(dataCheck.classId);
      }

      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, student, "Cập nhật thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Update failed", 0, null);
    }
  };

  this.getAllManager = async (id, classId, teacherId, schoolId, gradeId, studentIdFind, offset, limit, studentNameFind, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllManager({
        studentId: id,
        classId: classId,
        teacherId: teacherId,
        schoolId: schoolId,
        gradeId: gradeId,
        studentIdFind: studentIdFind,
        offset: offset,
        limit: limit,
        studentNameFind: studentNameFind
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
      result(Status.APIStatus.Error, err, "Lấy dữ liệu thất bại", 0, null);
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

      if (dataCheck.recordset[0].classId) {
        await modelClass.updateTotal(dataCheck.recordset[0].classId);
      }

      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, null, "Xóa thành công", 0, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, null, "Xóa thất bại", 0, null);
    }
  };


  this.createAdmin = async (userId, newData, result) => {
    // Gán dữ liệu
    student = {
      id: newData.id,
      classId: newData.classId,
      name: newData.name,
      phone: newData.phone,
      email: newData.email,
      password: newData.id,
      address: newData.address,
      status: newData.status || 1,
      cmndFamily: newData.cmndFamily,
      createBy: userId,
      updateBy: userId,
    };

    student.schoolId = await (await modelSchool.getSchoolIdFromTeacher({ userId: userId })).recordset[0].schoolId;

    try {
      // Yêu cầu nhập đầy đủ thông tin
      var validate = validator(student);
      if (validate != null) {
        return result(Status.APIStatus.Invalid, null, validate, 0, null);
      }

      // kiểm trả dữ liệu có tồn tại
      var checkDataPK = await checkStudent(student.id, student.email);
      if (checkDataPK != null) {
        return result(
          Status.APIStatus.Invalid,
          null,
          "Đã tồn tại tài khoản hoặc email",
          0,
          null
        );
      }

      // Kiểm tra dữ liệu khóa ngoại roleId và classId có tồn tại
      var checkDataFK = await checkClassAndCheckRole(
        student.classId,
        student.id,
        student.email,
        student.cmndFamily
      );
      if (checkDataFK) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      schoolIdClass = await (await modelClass.getIdSchoolFromIdClass({ classId: student.classId })).recordset[0].schoolId;
      schoolIdTeacher = await (await modelSchool.getSchoolIdFromTeacher({ userId: userId })).recordset[0].schoolId;
      if (
        schoolIdClass !== student.schoolId || student.schoolId !== schoolIdTeacher
      ) {
        return result(Status.APIStatus.Invalid, null, "Học sinh và lớp được chọn không cùng trường", 0, null);
      }

      // Mã hóa mật khẩu
      student.password = await bcrypt.hash(student.password, 10);

      // Thêm dữ liệu
      dataCreate = await model.create(student);

      if (student.classId) {
        await modelClass.updateTotal(student.classId);
      }

      if (newData.classId) {
        await modelClass.updateTotal(newData.classId);
      }

      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Ok,
        student,
        "Tạo dữ liệu thành công",
        1,
        null
      );
    } catch (err) {
      console.log(err);
      //Status, Data, Token,	Message, Total, Headers
      return result(
        Status.APIStatus.Error,
        null,
        "Tạo dữ liệu thất bại",
        0,
        null
      );
    }
  };

  this.updateAdmin = async (userId, newData, result) => {
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

      var dataStudent = await model.getAllAdmin({ studentId: newData.id, userId: userId });
      if (dataStudent.recordset.length == 0) {
        return result(
          Status.APIStatus.NotFound,
          null,
          "Không tồn tại dữ liệu",
          0,
          null
        );
      }

      // kiểm trả dữ liệu có tồn tại
      var dataCheck = await checkStudent(newData.id);
      if (!dataCheck) {
        return result(
          Status.APIStatus.Invalid,
          null,
          "Không tồn tại dữ liệu",
          0,
          null
        );
      }

      newData.schoolId = await (await modelSchool.getSchoolIdFromTeacher({ userId: userId })).recordset[0].schoolId;


      // Gán giá trị cho dữ liệu
      student = {
        id: newData.id,
        classId: newData.classId || dataCheck.classId,
        name: newData.name || dataCheck.name,
        phone: newData.phone || dataCheck.phone,
        email: newData.email || dataCheck.email,
        cmndFamily: newData.cmndFamily || dataCheck.cmndFamily,
        address: newData.address || dataCheck.address,
        status: newData.status || dataCheck.status,
        schoolId: newData.schoolId || dataCheck.schoolId,
        updateBy: userId,
      };

      // Kiểm tra cho email trong bảng student
      if (newData.email !== dataCheck.email) {
        email = newData.email
      }
      // kiểm trả dữ liệu có tồn tại
      var checkEmail = await checkStudentEmail(email);
      if (checkEmail) {
        return result(
          Status.APIStatus.Invalid,
          null,
          checkEmail,
          0,
          null
        );
      }

      // Kiểm tra dữ liệu khóa ngoại roleId và classId có tồn tại
      var checkDataFK = await checkClassAndCheckRole(
        student.classId,
        student.id,
        student.email,
        student.cmndFamily
      );
      if (checkDataFK) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      schoolIdClass = await (await modelClass.getIdSchoolFromIdClass({ classId: student.classId })).recordset[0].schoolId;
      schoolIdTeacher = await (await modelSchool.getSchoolIdFromTeacher({ userId: userId })).recordset[0].schoolId;
      if (
        schoolIdClass !== student.schoolId || student.schoolId !== schoolIdTeacher
      ) {
        return result(Status.APIStatus.Invalid, null, "Học sinh và lớp được chọn không cùng trường", 0, null);
      }

      if (newData.password) {
        if (newData.password.length < 6) {
          //Status, Data,	Message, Total, Headers
          return result(
            Status.APIStatus.Error,
            null,
            "Độ dài mật khẩu yêu cầu tối thiểu 6 ký tự",
            0,
            null
          );
        }
        // Mã hóa mật khẩu
        student.password = await bcrypt.hash(newData.password, 10);
      } else {
        // lấy mật khẩu cho học sinh
        dataStudent = await modelAuth.loginStudent(student.id);
        if (
          dataStudent.recordset.length !== 0 &&
          dataStudent.recordset[0].password
        ) {
          student.password = dataStudent.recordset[0].password;
        }
      }

      // Update dữ liệu
      dataUpdate = await model.update(student);

      if (student.classId) {
        await modelClass.updateTotal(student.classId);
      }

      if (dataCheck.classId) {
        await modelClass.updateTotal(dataCheck.classId);
      }

      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, student, "Cập nhật thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Update failed", 0, null);
    }
  };

  this.getAllAdmin = async (id, classId, teacherId, schoolId, gradeId, userId, studentIdFind, offset, limit, studentNameFind, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllAdmin({
        studentId: id,
        classId: classId,
        teacherId: teacherId,
        schoolId: schoolId,
        gradeId: gradeId,
        userId: userId,
        studentIdFind: studentIdFind,
        offset: offset,
        limit: limit,
        studentNameFind: studentNameFind
      });
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
      result(Status.APIStatus.Error, err, "Lấy dữ liệu thất bại", 0, null);
    }
  };

  this.deleteAdmin = async (id, result) => {
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

      if (dataCheck.recordset[0].classId) {
        await modelClass.updateTotal(dataCheck.recordset[0].classId);
      }

      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, null, "Xóa thành công", 0, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, null, "Xóa thất bại", 0, null);
    }
  };


  this.updatePassword = async (userId, oldPassword, newPassword, result) => {
    try {
      if (!oldPassword || !newPassword) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Error,
          null,
          "Bạn chưa nhập đầy đủ thông tin",
          0,
          null
        );
      }

      if (oldPassword.length < 6 || newPassword.length < 6) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Error,
          null,
          "Độ dài mật khẩu yêu cầu tối thiểu 6 ký tự",
          0,
          null
        );
      }

      // lấy mật khẩu cho học sinh
      dataStudent = await modelAuth.loginStudent(userId);

      if (
        dataStudent.recordset.length == 0 ||
        !bcrypt.compareSync(oldPassword, dataStudent.recordset[0].password)
      ) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Error,
          null,
          "Mật khẩu không đúng",
          0,
          null
        );
      }

      newPassword = await bcrypt.hash(newPassword, 10);
      modelAuth.updatePassswordStudent(userId, newPassword);

      result(
        Status.APIStatus.Ok,
        null,
        "Cập nhật mật khẩu thành công",
        1,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Update failed", 0, null);
    }
  };

  this.transferClassManager = async (oldClass, newClass, result) => {
    try {
      if (!oldClass || !newClass) {
        //Status, Data,	Message, Total, Headers
        return result(Status.APIStatus.Error, null, "Thiếu dữ liệu", 0, null);
      }

      if (!(oldClass % 1 === 0) || !(newClass % 1 === 0)) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Error,
          null,
          "Sai kiểu dữ liệu",
          0,
          null
        );
      }

      schoolIdNewClass = await (await modelSchool.getSchoolIdFromClass({ classId: newClass })).recordset[0].schoolId;
      schoolIdOldClass = await (await modelSchool.getSchoolIdFromClass({ classId: oldClass })).recordset[0].schoolId;
      if (
        !schoolIdNewClass || !schoolIdOldClass || schoolIdNewClass !== schoolIdOldClass
      ) {
        return result(Status.APIStatus.Invalid, null, "Hai lớp học được chọn không cùng trường", 0, null);
      }

      data = await model.transferClass(oldClass, newClass);

      await modelClass.updateTotal(oldClass);
      await modelClass.updateTotal(newClass);

      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, null, "Cập nhật thành công", 0, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, null, "Cập nhật thất bại", 0, null);
    }
  };

  this.transferClassAdmin = async (oldClass, newClass, userId, result) => {
    try {
      if (!oldClass || !newClass) {
        //Status, Data,	Message, Total, Headers
        return result(Status.APIStatus.Error, null, "Thiếu dữ liệu", 0, null);
      }

      if (!(oldClass % 1 === 0) || !(newClass % 1 === 0)) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Error,
          null,
          "Sai kiểu dữ liệu",
          0,
          null
        );
      }

      schoolIdNewClass = await (await modelSchool.getSchoolIdFromClass({ classId: newClass })).recordset[0].schoolId;
      schoolIdOldClass = await (await modelSchool.getSchoolIdFromClass({ classId: oldClass })).recordset[0].schoolId;
      schoolIdTeacher = await (await modelSchool.getSchoolIdFromTeacher({ userId: userId })).recordset[0].schoolId;
      if (
        !schoolIdNewClass || !schoolIdOldClass || !schoolIdTeacher || schoolIdNewClass !== schoolIdOldClass || schoolIdNewClass !== schoolIdTeacher
      ) {
        return result(Status.APIStatus.Invalid, null, "Hai lớp học được chọn không cùng trường", 0, null);
      }

      data = await model.transferClass(oldClass, newClass);

      await modelClass.updateTotal(oldClass);
      await modelClass.updateTotal(newClass);

      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, null, "Cập nhật thành công", 0, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, null, "Cập nhật thất bại", 0, null);
    }
  };

  this.getAllTeacher = async (id, classId, gradeId, studentIdFind, userId, offset, limit, studentNameFind, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllTeacher({
        studentId: id,
        userId: userId,
        classId: classId,
        gradeId: gradeId,
        studentIdFind: studentIdFind,
        offset: offset,
        limit: limit,
        studentNameFind: studentNameFind
      });
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
      result(Status.APIStatus.Error, err, "Lấy dữ liệu thất bại", 0, null);
    }
  };

  this.getFamily = async (userId, offset, limit, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAll({
        familyCMND: userId,
        offset: offset,
        limit: limit
      });
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


  this.getStudent = async (userId, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllManager({
        studentId: userId
      });
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
