var School = require("../models/School");
var Status = require("../common/core");

var model = new School();

module.exports = function () {
  function validator(school) {
    if (
      !school.id ||
      !school.name ||
      !school.address ||
      !school.type
    ) {
      return "Bạn chưa nhập thông tin đầy đủ";
    }

    if (![1, 2, 3].includes(school.type)) {
      return "Vui lòng chọn cấp bậc cho trường trong: 1, 2, 3";
    }
    return null;
  }

  this.getAllManager = async (id, offset, limit, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllManager({
        schoolId: id,
        offset: offset,
        limit: limit
      });
      if (data.recordset.length !== 0) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Ok,
          data.recordset,
          "Lấy dữ liệu thành công",
          data.recordset.length,
          null
        );
      }
      //Status, Data,	Message, Total, Headers
      result(
        Status.APIStatus.NotFound,
        null,
        "Không tìm thấy dữ liệu",
        0,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, err, "Lấy dữ liệu thất bại", 0, null);
    }
  };

  this.createManager = async (newData, userId, result) => {
    // Gán dữ liệu
    school = {
      id: newData.id,
      name: newData.name,
      address: newData.address,
      type: newData.type,
      description: newData.description,
      createBy: userId,
      updateBy: userId
    };

    var validate = validator(school);
    if (validate) {
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
      return result(Status.APIStatus.Ok, school, "Tạo dữ liệu thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, null, "Tạo dữ liệu thất bại", 0, null);
    }
  };

  this.updateManager = async (newData, userId, result) => {
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
        id: newData.id,
        name: newData.name || dataCheck.recordset[0].name,
        address: newData.address || dataCheck.recordset[0].address,
        type: newData.type || dataCheck.recordset[0].type,
        description: newData.description || dataCheck.recordset[0].description,
        updateBy: userId
      };

      var validate = validator(school);
      if (validate) {
        return result(Status.APIStatus.Invalid, null, validate, 0, null);
      }

      // Update dữ liệu
      dataUpdate = await model.update(school);
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Ok, school, "Cập nhật thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, err, "Update failed", 0, null);
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

  this.getAllAdmin = async (id, userId, offset, limit, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllAdmin({
        schoolId: id, userId: userId,
        offset: offset,
        limit: limit
      });
      if (data.recordset.length !== 0) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Ok,
          data.recordset,
          "Lấy dữ liệu thành công",
          data.recordset.length,
          null
        );
      }
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.NotFound, null, "Không tìm thấy dữ liệu", 0, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, err, "Lấy dữ liệu thất bại", 0, null);
    }
  };

  this.deleteAdmin = async (id, userId, result) => {
    try {
      // kiểm trả dữ liệu có tồn tại
      dataCheck = await model.getAllAdmin({ schoolId: id, userId: userId })
      if (dataCheck.recordset.length === 0) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.NotFound,
          null,
          "Không tìm thấy dữ liệu tương ứng với " + id,
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

  this.createAdmin = async (newData, userId, result) => {
    // Gán dữ liệu
    school = {
      id: newData.id,
      name: newData.name,
      address: newData.address,
      type: newData.type,
      description: newData.description,
      createBy: userId,
      updateBy: userId
    };

    var validate = validator(school);
    if (validate) {
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
      return result(Status.APIStatus.Ok, school, "Tạo dữ liệu thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, null, "Tạo dữ liệu thất bại", 0, null);
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
      dataCheck = await model.getAllAdmin({ userId: userId });
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
        id: dataCheck.recordset[0].id,
        name: newData.name || dataCheck.recordset[0].name,
        address: newData.address || dataCheck.recordset[0].address,
        type: newData.type || dataCheck.recordset[0].type,
        description: newData.description || dataCheck.recordset[0].description,
        updateBy: userId
      };

      var validate = validator(school);
      if (validate) {
        return result(Status.APIStatus.Invalid, null, validate, 0, null);
      }

      // Update dữ liệu
      dataUpdate = await model.update(school);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, school, "Cập nhật thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, err, "Cập nhật thất bại", 0, null);
    }
  };
};
