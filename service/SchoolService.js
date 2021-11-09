var School = require("../models/School");
var Status = require("../common/core");

var model = new School();

module.exports = function () {
  function validator(school) {
    if (
      school.id == null ||
      school.name == null ||
      school.address == null ||
      school.type == null
    ) {
      //Status, Data,	Message, Total, Headers
      return "Bạn chưa nhập thông tin đầy đủ";
    }

    if (![1, 2, 3].includes(school.type)) {
      //Status, Message, Total, Headers
      return "Vui lòng chọn cấp bậc cho trường trong: 1, 2, 3";
    }
    return null;
  }

  this.create = async (newData, result) => {
    // Gán dữ liệu
    school = {
      id: newData.id || null,
      name: newData.name || null,
      address: newData.address || null,
      type: newData.type || null,
      description: newData.description || null,
      createDay: Date.now(),
      updateDay: Date.now(),
    };

    var validate = validator(school);
    if (validate != null) {
      return result(Status.APIStatus.Invalid, null, validate, 0, null);
    }

    try {
      // kiểm trả dữ liệu có tồn tại
      dataCheck = await model.getOne(newData.id);
      if (dataCheck.recordset.length !== 0) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Existed,
          null,
          "Đã tồn tại id: " + newData.id,
          0,
          null
        );
      }

      // Thêm dữ liệu
      dataCreate = await model.create(school);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, school, "Tạo dữ liệu thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Tạo dữ liệu thất bại", 0, null);
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
          "Không tìm thấy dữ liệu tương ứng với id bằng " + newData.id,
          0,
          null
        );
      }

      // Gán giá trị cho dữ liệu
      school = {
        name: newData.name || dataCheck.recordset[0].name,
        address: newData.address || dataCheck.recordset[0].address,
        type: newData.type || dataCheck.recordset[0].type,
        description: newData.description || dataCheck.recordset[0].description,
        createDay: dataCheck.recordset[0].createDay,
        updateDay: Date.now(),
      };

      // Update dữ liệu
      dataUpdate = await model.update(school);
      //Status, Data,	Message, Total, Headers
      result(
        Status.APIStatus.Ok,
        school,
        "Cập nhật thành công",
        1,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, err, "Update failed", 0, null);
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
            "Không tìm thấy dữ liệu tương ứng với id bằng " + id,
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
      result(Status.APIStatus.Error, err, "Lấy dữ liệu thất bại", 0, null);
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
          "Không tìm thấy dữ liệu tương ứng với id bằng " + id,
          0,
          null
        );
      }

      // // Lấy những dữ liệu tham chiếu tới bảng
      // dataNotification =
      //   await modelNotification.getByExtracurricularActivitiesId(id);

      // dataNotification.recordset.forEach(async (element) => {
      //   //xóa dữ liệu của khóa ngoại
      //   await modelNotification.delete(element.id);
      // });
      // xóa dữ liệu
      dataDelete = await model.delete(id);

      //Status, Data,	Message, Total, Headers
      result(
        Status.APIStatus.Ok,
        null,
        "Xóa thành công",
        0,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Error,
        null,
        "Xóa thất bại",
        0,
        null
      );
    }
  };
};
