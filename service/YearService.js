var Status = require("../common/core");
var Year = require("../models/Year");

var model = new Year();

module.exports = function () {
  function validator(start, end) {
    if (!start || !end) {
      return "Thiếu dữ liệu";
    }

    if (!(start % 1 === 0) || !(end % 1 === 0)) {
      return "Sai kiểu dữ liệu";
    }

    if(parseInt(end) - parseInt(start) !== 1){
        return "Năm bắt đầu lớn hơn năm kết thúc hoặc hai năm học không liền kề"
    }
    return null;
  }

  this.create = async (newData, result) => {
    try {
      var validate = validator(newData.start, newData.end);
      if (validate) {
        return result(Status.APIStatus.Invalid, null, validate, 0, null);
      }

      var name = newData.start + "-" + newData.end;

      dataCheck = await model.getByName(name);
      if(dataCheck.recordset.length !== 0){
        return result(Status.APIStatus.Invalid, null, "Đã tồn tại năm học", 0, null);
      }

      // Thêm dữ liệu
      dataCreate = await model.create(name);
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Ok, null, "Tạo dữ liệu thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, null, "Tạo dữ liệu thất bại", 0, null);
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


      var validate = validator(newData.start, newData.end);
      if (validate) {
        return result(Status.APIStatus.Invalid, null, validate, 0, null);
      }

      newData.name = newData.start + "-" + newData.end;

      dataCheck = await model.getByName(newData.name);
      if(dataCheck.recordset.length !== 0 && dataCheck.recordset[0].id !== newData.id){
        return result(Status.APIStatus.Invalid, null, "Đã tồn tại năm học", 0, null);
      }

      // Update dữ liệu
      dataUpdate = await model.update(newData);
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Ok, null, "Cập nhật thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, err, "Update failed", 0, null);
    }
  };

  this.getAll = async (id, name, offset, limit, result) => {
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
        data = await model.getAll({name : name,
          offset: offset,
          limit: limit});
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
};
