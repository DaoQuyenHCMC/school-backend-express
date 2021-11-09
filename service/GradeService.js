var Grade = require("../models/Grade");
var School = require("../models/School");
var Status = require("../common/core");

var model = new Grade();
var modelSchool = new School();

module.exports = function () {
  function validator(name) {
    if (name == null) {
      //Status, Data,	Message, Total, Headers
      return "Bạn chưa nhập thông tin đầy đủ";
    }

    if (name < 1 || name > 12) {
      //Status, Message, Total, Headers
      return "Vui lòng chọn khối từ 1 đến 12";
    }
    return null;
  }

  this.create = async (newData, result) => {
    grade = {
      schoolId: newData.schoolId || null,
      name: newData.name || null,
      createDay: Date.now(),
      updateDay: Date.now(),
    };

    var validate = validator(grade.name);
    if (validate != null) {
      return result(Status.APIStatus.Invalid, null, validate, 0, null);
    }

    try {
      if (grade.schoolId != null) {
        dataSchool = await modelSchool.getOne(grade.schoolId);
        if (dataSchool.recordset.length == 0) {
          return result(
            Status.APIStatus.NotFound,
            null,
            "Không tìm thấy dữ liệu với id khóa ngoại school: " +
              grade.schoolId,
            0,
            null
          );
        }
      }
      // Thêm dữ liệu
      dataCreate = await model.create(grade);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, grade, "Tạo thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
    }
  };

  this.update = async (newData, result) => {
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
          "Không tìm thấy khối với id bằng " + newData.id,
          0,
          null
        );
      }

      // kiểm tra dữ liệu của khóa ngoại có tồn tại
      if (newData.schoolId != null) {
        dataSchool = await modelSchool.getOne(newData.schoolId);
        if (dataSchool.recordset.length == 0) {
          return result(
            Status.APIStatus.NotFound,
            null,
            "Không tìm thấy dữ liệu với id khóa ngoại school: " +
              newData.schoolId,
            0,
            null
          );
        }
      }
      // Gán giá trị cho dữ liệu
      grade = {
        schoolId: newData.schoolId || dataCheck.recordset[0].schoolId,
        name: newData.name || dataCheck.recordset[0].name,
        createDay: dataCheck.recordset[0].createDay,
        updateDay: Date.now(),
      };

      // Update dữ liệu
      dataUpdate = await model.update(grade);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, grade, "Cập nhật thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, err, "Sai kiểu dữ liệu", 0, null);
    }
  };

  this.getAll = async (id, result) => {
    try {
      if (id) {
        // Lấy tất cả dữ liệu
        data = await model.getOne(id);

        if (data.recordset.length == 0) {
          return result(
            Status.APIStatus.NotFound,
            null,
            "Không tìm thấy dữ liệu với id: " + id,
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
      }
      if (!id) {
        // Lấy tất cả dữ liệu
        data = await model.getAll();
        //Status, Data,	Message, Total, Headers
        result(
          Status.APIStatus.Ok,
          data.recordset,
          "Lấy dữ liệu thành công",
          data.recordset.length,
          null
        );
      }
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, err, "Sai kiểu dữ liệu", 0, null);
    }
  };

  this.delete = async (id, result) => {
    try {
      // kiểm trả dữ liệu có tồn tại
      dataCheck = await model.getOne(id);
      if (dataCheck.recordset.length === 0) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.NotFound,
          null,
          "Không tìm thấy dữ liệu với id: " + id,
          0,
          null
        );
      }

      // xóa dữ liệu
      dataDelete = await model.delete(id);

      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, null, "Xóa grade thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Error,
        null,
        "Sai kiểu dữ liệu",
        0,
        null
      );
    }
  };
};
