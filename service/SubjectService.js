var Status = require("../common/core");
var Subject = require("../models/Subject");

var model = new Subject();

module.exports = function () {
  this.create = async (newData, result) => {
    // Gán dữ liệu
    subject = {
      name: newData.name || null
    };
    try {
      // Thêm dữ liệu
      dataCreate = await model.create(subject);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, subject, "Tạo dữ liệu thành công", 1, null);
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
      subject = {
        id: newData.id,
        name: newData.name || dataCheck.recordset[0].name
      };

      // Update dữ liệu
      dataUpdate = await model.update(subject);
      //Status, Data,	Message, Total, Headers
      result(
        Status.APIStatus.Ok,
        subject,
        "Cập nhật thành công",
        1,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, err, "Update failed", 0, null);
    }
  };

  this.getAll = async (id, offset, limit, result) => {
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
        data = await model.getAll({
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
