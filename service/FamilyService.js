var Status = require("../common/core");
var Family = require("../models/Family");
var Student = require("../models/Student");
var Teacher = require("../models/Teacher");
const bcrypt = require("bcryptjs");
var Auth = require("../models/Auth");
var model = new Family();
var modelAuth = new Auth();
var modelStudent = new Student();
var modelTeacher = new Teacher();

module.exports = function () {
  // Kiểm tra dữ liệu
  function validator(email, cmnd) {
    if (!cmnd || !email) return "Bạn chưa nhập đầy đủ thông tin";
    return null;
  }

  // Kiểm tra dữ liệu khóa chính
  const checkCMND = async (email, cmnd) => {
    try {
      if (cmnd) {
        data = await model.getAll({ cmnd: cmnd });
        if (data.recordset.length !== 0) {
          return data.recordset[0];
        }
      }
      if (email) {
        dataCheckEmail = await model.checkEmail(email);
        if (dataCheckEmail.recordset.length !== 0) {
          return dataCheckEmail.recordset[0];
        }
      }
    } catch (err) {
      console.log(err);
    }
    return null;
  }

  const checkEmail = async (email) => {
    try {
      dataCheckEmailTeacher = await modelTeacher.checkEmail(email);
      if (dataCheckEmailTeacher.recordset.length !== 0) {
        return "Email đã được sử dụng";
      }

      dataCheckEmailStudent = await modelStudent.checkEmail(email);
      if (dataCheckEmailStudent.recordset.length !== 0) {
        return "Email đã được sử dụng";
      }

      dataCheckEmailfamily = await model.checkEmail(email);
      if (dataCheckEmailfamily.recordset.length !== 0) {
        return "Email đã được sử dụng";
      }
    } catch (err) {
      return "Lỗi"
    }
    return null;
  };

  // Thêm
  this.create = async (newData, result) => {
    // Gán dữ liệu
    family = {
      cmnd: newData.cmnd || null,
      name: newData.name || null,
      phone: newData.phone || null,
      password: newData.cmnd || null,
      email: newData.email || null
    };

    try {
      // Yêu cầu nhập đầy đủ thông tin roleId, schoolId, cmnd, email, name, address, phone
      var validate = validator(family.email, family.cmnd);
      if (validate != null) {
        return result(Status.APIStatus.Invalid, null, validate, 0, null);
      }
      // kiểm trả dữ liệu có tồn tại
      var checkDataPK = await checkCMND(family.email, family.cmnd);
      if (checkDataPK != null) {
        return result(
          Status.APIStatus.Invalid,
          null,
          "Dữ liệu đã tồn tại",
          0,
          null
        );
      }
      // Mã hóa mật khẩu
      family.password = await bcrypt.hash(family.password, 10);
      // Thêm dữ liệu
      dataCreate = await model.create(family);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, family, "Tạo dữ liệu thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Tạo dữ liệu thất bại", 0, null);
    }
  };

  this.update = async (newData, result) => {
    if (!newData?.cmnd) {
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
      var dataCheck = await checkCMND(null, newData.cmnd);
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
      family = {
        cmnd: newData.cmnd || newData.cmnd,
        name: newData.name || dataCheck.name,
        phone: newData.phone || dataCheck.phone,
        email: newData.email || dataCheck.email,
        password: null,
      };

      email = newData.email !== dataCheck.email ? newData.email : null;
      if (email) {
        var checkEmailCmnd = await checkEmail(email);
        if (checkEmailCmnd) {
          return result(
            Status.APIStatus.Invalid,
            null,
            checkEmailCmnd,
            0,
            null
          );
        }
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
        family.password = await bcrypt.hash(newData.password, 10);
      } else {
        // lấy mật khẩu cho học sinh
        dataFamilyPassword = await modelAuth.loginFamily(family.cmnd);
        if (
          dataFamilyPassword.recordset.length !== 0 &&
          dataFamilyPassword.recordset[0].password
        ) {
          family.password = dataFamilyPassword.recordset[0].password;
        }
      }
      // Update dữ liệu
      dataUpdate = await model.update(family);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, family, "Cập nhật dữ liệu thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Cập nhật dữ liệu thất bại", 0, null);
    }
  };

  this.getAll = async (id, offset, limit, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAll({
        cmnd: id,
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

  this.getAllFamily = async (userId, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAll({
        cmnd: userId
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
      dataFamily = await modelAuth.loginFamily(userId);

      if (
        dataFamily.recordset.length == 0 ||
        !bcrypt.compareSync(oldPassword, dataFamily.recordset[0].password)
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
      modelAuth.updatePassswordFamily(userId, newPassword);

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
};
