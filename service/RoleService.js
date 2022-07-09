var Role = require("../models/Role");

var model = new Role();
var Status = require("../common/core");

module.exports = function () {
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
};
