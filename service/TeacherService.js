var Status = require("../common/core");
const bcrypt = require("bcryptjs");

var Teacher = require("../models/Teacher");
var Auth = require("../models/Auth");
var Student = require("../models/Student");
var School = require("../models/School");
var Role = require("../models/Role");
var Family = require("../models/Family");

var model = new Teacher();
var modelRole = new Role();
var modelAuth = new Auth();
var modelSchool = new School();
var modelStudent = new Student();
var modelFamily = new Family();

module.exports = function () {
  // Kiểm tra dữ liệu
  function validator(teacher) {
    if (
      !teacher.id ||
      !teacher.roleId ||
      !teacher.schoolId ||
      !teacher.cmnd ||
      !teacher.name ||
      !teacher.email
    ) {
      return "Bạn chưa nhập đầy đủ thông tin";
    }
    return null;
  }

  // Kiểm tra dữ liệu
  function validatorAdmin(teacher) {
    if (
      !teacher.id ||
      !teacher.roleId ||
      !teacher.cmnd ||
      !teacher.name ||
      !teacher.email
    ) {
      return "Bạn chưa nhập đầy đủ thông tin";
    }
    return null;
  }
  // Kiểm tra dữ liệu khóa chính
  const checkTeacher = async (id, email, cmnd) => {
    try {
      if (id) {
        data = await model.getOne(id);
        if (data.recordset.length !== 0) {
          return "Dữ liệu đã tồn tại";
        }
      }

      if (email) {
        dataCheckEmailTeacher = await model.checkEmail(email);
        if (dataCheckEmailTeacher.recordset.length !== 0) {
          return "Email đã được sử dụng";
        }

        dataCheckEmailStudent = await modelStudent.checkEmail(email);
        if (dataCheckEmailStudent.recordset.length !== 0) {
          return "Email đã được sử dụng";
        }

        dataCheckEmailfamily = await modelFamily.checkEmail(email);
        if (dataCheckEmailfamily.recordset.length !== 0) {
          return "Email đã được sử dụng";
        }
      }

      if (cmnd) {
        dataCheckCMND = await model.checkCMND(cmnd);
        if (dataCheckCMND.recordset.length !== 0) {
          return "Số căn cước đã được sử dụng";
        }
      }
    } catch (err) {
      return "Lỗi"
    }
    return null;
  };

  const checkExisted = async (id, userId) => {
    try {
      data = await model.getAllAdmin({ userId: userId, teacherId: id });
      if (data.recordset.length !== 0) {
        return data.recordset[0];
      }
    } catch (err) {
      return "Lỗi"
    }
    return null;
  };

  const checkExistedAll = async (id) => {
    try {
      data = await model.getAllManager({ teacherId: id });
      if (data.recordset.length !== 0) {
        return data.recordset[0];
      }
    } catch (err) {
      return "Lỗi"
    }
    return null;
  };

  const checkSchoolAndCheckRole = async (roleId, schoolId, teachId, email) => {
    try {
      // Kiểm tra khóa ngoại role có tồn tại
      if (roleId != null) {
        dataRole = await modelRole.getOne(roleId);
        if (dataRole.recordset.length == 0) {
          return "Không tìm thấy role tương ứng";
        }
      }

      // Kiểm tra khóa ngoại school có tồn tại
      if (schoolId != null) {
        dataSchool = await modelSchool.getOne(schoolId);
        if (dataSchool.recordset.length == 0) {
          return "Không tìm thấy school tương ứng";
        }
      }

      // Kiểm tra tên tài khoản có trùng với student
      if (teachId != null) {
        dataStudent = await modelStudent.getOne(teachId);
        if (dataStudent.recordset.length != 0) {
          return "Đã tồn tại tên tài khoản";
        }

        // Kiểm tra email có tồn tại
        dataCheckEmail = await modelStudent.checkEmail(email);
        if (dataCheckEmail.recordset.length !== 0) {
          return "Đã tồn tại email";
        }
      }
    } catch (err) {
      return "Sai kiểu dữ liệu";
    }
    return null;
  };

  this.getAllManager = async (id, schoolId, teacherIdFind, offset, limit, teacherNameFind, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllManager({
        schoolId: schoolId,
        teacherId: id,
        teacherIdFind: teacherIdFind,
        offset: offset,
        limit: limit,
        teacherNameFind: teacherNameFind
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

  // Thêm
  this.createManager = async (userId, newData, result) => {
    // Gán dữ liệu
    teacher = {
      id: newData.id || null,
      roleId: newData.roleId || "TEACHER",
      schoolId: newData.schoolId || null,
      name: newData.name || null,
      phone: newData.phone || null,
      email: newData.email || null,
      cmnd: newData.cmnd || null,
      password: newData.id || null,
      address: newData.address || null,
      status: newData.status || 1,
      salary: newData.salary || null,
      createBy: userId,
      updateBy: userId,
    };

    try {
      // Yêu cầu nhập đầy đủ thông tin roleId, schoolId, cmnd, email, name
      var validate = validator(teacher);
      if (validate) {
        return result(Status.APIStatus.Invalid, null, validate, 0, null);
      }

      // kiểm trả dữ liệu có tồn tại
      var checkDataPK = await checkTeacher(
        teacher.id,
        teacher.email,
        teacher.cmnd
      );
      if (checkDataPK) {
        return result(
          Status.APIStatus.Invalid,
          null,
          checkDataPK,
          0,
          null
        );
      }

      // Kiểm tra dữ liệu khóa ngoại roleId và schoolId có tồn tại
      var checkDataFK = await checkSchoolAndCheckRole(
        teacher.roleId,
        teacher.schoolId,
        teacher.id
      );
      if (checkDataFK) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      // Mã hóa mật khẩu
      teacher.password = await bcrypt.hash(teacher.password, 10);

      // Thêm dữ liệu
      dataCreate = await model.create(teacher);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, teacher, "Tạo dữ liệu thành công", 1, null);
    } catch (err) {
      console.log(err);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Tạo dữ liệu thất bại", 0, null);
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
      var dataCheck = await checkExistedAll(newData.id);
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
      teacher = {
        id: newData.id,
        roleId: newData.roleId || dataCheck.roleId,
        schoolId: newData.schoolId || dataCheck.schoolId,
        name: newData.name || dataCheck.name,
        phone: newData.phone || dataCheck.phone,
        email: newData.email || dataCheck.email,
        cmnd: newData.cmnd || dataCheck.cmnd,
        password: null,
        address: newData.address || dataCheck.address,
        status: newData.status || dataCheck.status,
        salary: newData.salary || dataCheck.salary,
        update_by: userId,
      };

      // Kiểm tra dữ liệu khóa ngoại roleId và schoolId có tồn tại
      var checkDataFK = await checkSchoolAndCheckRole(
        teacher.roleId,
        teacher.schoolId,
        teacher.id
      );
      if (checkDataFK != null) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      email = null;
      cmnd = null;
      if (newData.email !== dataCheck.email) {
        // kiểm trả dữ liệu có tồn tại
        email = newData.email
      }
      if (newData.cmnd !== dataCheck.cmnd) {
        cmnd = newData.cmnd
      }

      // kiểm trả dữ liệu có tồn tại
      var checkEmailCmnd = await checkTeacher(
        null,
        email,
        cmnd
      );
      if (checkEmailCmnd) {
        return result(
          Status.APIStatus.Invalid,
          null,
          checkEmailCmnd,
          0,
          null
        );
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
        teacher.password = await bcrypt.hash(newData.password, 10);
      } else {
        // lấy mật khẩu cho giáo viên
        dataTeacher = await modelAuth.loginTeacher(teacher.id);
        if (
          dataTeacher.recordset.length !== 0 ||
          dataTeacher.recordset[0].password
        ) {
          teacher.password = dataTeacher.recordset[0].password;
        }
      }

      // Update dữ liệu
      dataUpdate = await model.update(teacher);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, teacher, "Cập nhật thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Cập nhật không thành công", 0, null);
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


  // Thêm
  this.createAdmin = async (userId, newData, result) => {
    // Gán dữ liệu
    teacher = {
      id: newData.id || null,
      roleId: newData.roleId || "TEACHER",
      name: newData.name || null,
      phone: newData.phone || null,
      email: newData.email || null,
      cmnd: newData.cmnd || null,
      password: newData.id || null,
      address: newData.address || null,
      status: newData.status || 1,
      salary: newData.salary || null,
      createBy: userId,
      updateBy: userId,
    };

    try {
      // Yêu cầu nhập đầy đủ thông tin roleId, schoolId, cmnd, email, name
      var validate = validatorAdmin(teacher);
      if (validate) {
        return result(Status.APIStatus.Invalid, null, validate, 0, null);
      }

      if (teacher.roleId === 'MANAGER') {
        return result(Status.APIStatus.Invalid, null, "Không được phép cấp quyền quản lý", 0, null);
      }

      // kiểm trả dữ liệu có tồn tại
      var checkDataPK = await checkExistedAll(
        teacher.id
      );
      if (checkDataPK) {
        return result(
          Status.APIStatus.Existed,
          null,
          "Đã tồn tại tên tài khoản",
          0,
          null
        );
      }

      // Kiểm tra dữ liệu khóa ngoại roleId và schoolId có tồn tại
      var checkDataFK = await checkSchoolAndCheckRole(
        teacher.roleId,
        teacher.schoolId,
        teacher.id
      );
      if (checkDataFK) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      teacher.schoolId = await (await modelSchool.getSchoolIdFromTeacher({ userId: userId })).recordset[0].schoolId;

      // Mã hóa mật khẩu
      teacher.password = await bcrypt.hash(teacher.password, 10);

      // Thêm dữ liệu
      dataCreate = await model.create(teacher);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, teacher, "Tạo dữ liệu thành công", 1, null);
    } catch (err) {
      console.log(err);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Tạo dữ liệu thất bại", 0, null);
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
      // kiểm trả dữ liệu có tồn tại
      var dataCheck = await checkExisted(newData.id, userId);
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
      teacher = {
        id: newData.id,
        roleId: newData.roleId || dataCheck.roleId,
        name: newData.name || dataCheck.name,
        phone: newData.phone || dataCheck.phone,
        email: newData.email || dataCheck.email,
        cmnd: newData.cmnd || dataCheck.cmnd,
        password: null,
        address: newData.address || dataCheck.address,
        status: newData.status || dataCheck.status,
        salary: newData.salary || dataCheck.salary,
        update_by: userId,
      };

      // Kiểm tra dữ liệu khóa ngoại roleId và schoolId có tồn tại
      var checkDataFK = await checkSchoolAndCheckRole(
        teacher.roleId,
        teacher.schoolId,
        teacher.id
      );
      if (checkDataFK != null) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      email = newData.email !== dataCheck.email ? newData.email : null;
      cmnd = newData.cmnd !== dataCheck.cmnd ? newData.cmnd : null;

      // kiểm trả dữ liệu có tồn tại
      var checkEmailCmnd = await checkTeacher(
        null,
        email,
        cmnd
      );
      if (checkEmailCmnd) {
        return result(
          Status.APIStatus.Invalid,
          null,
          checkEmailCmnd,
          0,
          null
        );
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
        teacher.password = await bcrypt.hash(newData.password, 10);
      } else {
        // lấy mật khẩu cho giáo viên
        dataTeacher = await modelAuth.loginTeacher(teacher.id);
        if (
          dataTeacher.recordset.length !== 0 ||
          dataTeacher.recordset[0].password
        ) {
          teacher.password = dataTeacher.recordset[0].password;
        }
      }

      teacher.schoolId = await (await modelSchool.getSchoolIdFromTeacher({ userId: userId })).recordset[0].schoolId;

      // Update dữ liệu
      dataUpdate = await model.update(teacher);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, teacher, "Cập nhật thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Cập nhật không thành công", 0, null);
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

      // lấy mật khẩu cho giáo viên
      dataTeacher = await modelAuth.loginTeacher(userId);

      if (
        dataTeacher.recordset.length == 0 ||
        !bcrypt.compareSync(oldPassword, dataTeacher.recordset[0].password)
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
      modelAuth.updatePassswordTeacher(userId, newPassword);

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

  this.getAllAdmin = async (id, userId, teacherIdFind, offset, limit, teacherNameFind, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllAdmin({
        userId: userId,
        teacherId: id,
        teacherIdFind: teacherIdFind,
        offset: offset,
        limit: limit,
        teacherNameFind: teacherNameFind
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

      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, null, "Xóa thành công", 0, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, null, "Xóa thất bại", 0, null);
    }
  };

  this.getAllTeacher = async (userId, offset, limit, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllTeacher({
        teacherId: userId,
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
      result(Status.APIStatus.Error, err, "Lấy dữ liệu thất bại", 0, null);
    }
  };

  this.updateTeacher = async (userId, newData, result) => {
    try {
      // kiểm trả dữ liệu có tồn tại
      var dataCheck = await checkExisted(userId, userId);
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
      teacher = {
        id: userId,
        roleId: dataCheck.roleId,
        name: newData.name || dataCheck.name,
        phone: newData.phone || dataCheck.phone,
        email: newData.email || dataCheck.email,
        cmnd: newData.cmnd || dataCheck.cmnd,
        password: null,
        address: newData.address || dataCheck.address,
        status: newData.status || dataCheck.status,
        salary: newData.salary || dataCheck.salary,
        update_by: userId,
      };

      // Kiểm tra dữ liệu khóa ngoại roleId và schoolId có tồn tại
      var checkDataFK = await checkSchoolAndCheckRole(
        teacher.roleId,
        teacher.schoolId,
        teacher.id
      );
      if (checkDataFK != null) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      email = null;
      cmnd = null;
      if (newData.email !== dataCheck.email) {
        // kiểm trả dữ liệu có tồn tại
        email = newData.email
      }
      if (newData.cmnd !== dataCheck.cmnd) {
        cmnd = newData.cmnd
      }

      // kiểm trả dữ liệu có tồn tại
      var checkEmailCmnd = await checkTeacher(
        null,
        email,
        cmnd
      );
      if (checkEmailCmnd) {
        return result(
          Status.APIStatus.Invalid,
          null,
          checkEmailCmnd,
          0,
          null
        );
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
        teacher.password = await bcrypt.hash(newData.password, 10);
      } else {
        // lấy mật khẩu cho giáo viên
        dataTeacher = await modelAuth.loginTeacher(teacher.id);
        if (
          dataTeacher.recordset.length !== 0 ||
          dataTeacher.recordset[0].password
        ) {
          teacher.password = dataTeacher.recordset[0].password;
        }
      }

      teacher.schoolId = await (await modelSchool.getSchoolIdFromTeacher({ userId: userId })).recordset[0].schoolId;

      // Update dữ liệu
      dataUpdate = await model.update(teacher);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, null, "Cập nhật thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Cập nhật không thành công", 0, null);
    }
  };
};
