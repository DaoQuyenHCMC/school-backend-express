var ExtracurricularActivities = require("../models/ExtracurricularActivities");
var Status = require("../common/core");
var School = require("../models/School");

var model = new ExtracurricularActivities();
var modelSchool = new School();

module.exports = function () {
  // Kiểm tra dữ liệu khóa ngoại
  const checkSchool = async (schoolId) => {
    try {
      // Kiểm tra khóa ngoại school có tồn tại
      if (schoolId != null) {
        dataSchool = await modelSchool.getOne(schoolId);
        if (dataSchool.recordset.length == 0) {
          return "Không tìm thấy trường học tương ứng";
        }
      }
    } catch (err) {
      return "Sai kiểu dữ liệu";
    }
    return null;
  };

  this.getAll = async (id, schoolId, offset, limit, result) => {
    try {
      if (id) {
        // Lấy tất cả dữ liệu
        data = await model.getOne(id);

        if (data.recordset.length == 0) {
          return result(
            Status.APIStatus.NotFound,
            null,
            "Không tìm thấy dữ liệu ",
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
          schoolId: schoolId,
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
      result(Status.APIStatus.Error, err, "Sai kiểu dữ liệu", 0, null);
    }
  };


  this.createManager = async (newData, result) => {
    // Gán dữ liệu
    extracurricularActivities = {
      title: newData.title,
      schoolId: newData.schoolId,
      location: newData.location,
      day: newData.day,
      description: newData.description,
    };

    try {
      // Kiểm tra dữ liệu khóa ngoại roleId và schoolId có tồn tại
      var checkDataFK = await checkSchool(extracurricularActivities.schoolId);
      if (checkDataFK != null) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      // Thêm dữ liệu
      dataCreate = await model.create(extracurricularActivities);
      //Status, Data,	Message, Total, Headers
      result(
        Status.APIStatus.Ok,
        extracurricularActivities,
        "Tạo dữ liệu thành công",
        1,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Tạo dữ liệu thất bại", 0, null);
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
          "Not found any matched with id equal " + newData.id,
          0,
          null
        );
      }

      // Kiểm tra dữ liệu khóa ngoại roleId và schoolId có tồn tại
      var checkDataFK = await checkSchool(newData.schoolId);
      if (checkDataFK != null) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      // Gán giá trị cho dữ liệu
      extracurricularActivities = {
        id: newData.id,
        title: newData.title || dataCheck.recordset[0].title,
        location: newData.location || dataCheck.recordset[0].location,
        schoolId: newData.schoolId || dataCheck.recordset[0].schoolId,
        day: newData.day || dataCheck.recordset[0].day,
        time: newData.time || dataCheck.recordset[0].time,
        description: newData.description || dataCheck.recordset[0].description,
      };

      // Update dữ liệu
      dataUpdate = await model.update(extracurricularActivities);
      //Status, Data,	Message, Total, Headers
      result(
        Status.APIStatus.Ok,
        extracurricularActivities,
        "Cập nhật dữ liệu thành công",
        1,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, err, "Cập nhật dữ liệu thất bại", 0, null);
    }
  };

  this.getAllManager = async (id, schoolId, offset, limit, result) => {
    try {
      if (id) {
        // Lấy tất cả dữ liệu
        data = await model.getOne(id);

        if (data.recordset.length == 0) {
          return result(
            Status.APIStatus.NotFound,
            null,
            "Không tìm thấy dữ liệu ",
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
      }
      if (!id) {
        // Lấy tất cả dữ liệu
        data = await model.getAll({
          schoolId: schoolId,
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
      result(Status.APIStatus.Error, err, "Sai kiểu dữ liệu", 0, null);
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
          "Không tìm thấy dữ liệu",
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
        "Hiện đang có thông báo sử dụng hoạt động này",
        0,
        null
      );
    }
  };

  this.createAdmin = async (newData, userId, result) => {
    // Gán dữ liệu
    extracurricularActivities = {
      title: newData.title || null,
      schoolId: newData.schoolId || null,
      location: newData.location || null,
      day: newData.day || null,
      description: newData.description || null,
    };

    try {
      // Kiểm tra dữ liệu khóa ngoại roleId và schoolId có tồn tại
      var checkDataFK = await checkSchool(extracurricularActivities.schoolId);
      if (checkDataFK != null) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      // Thêm dữ liệu
      dataCreate = await model.create(extracurricularActivities);
      //Status, Data,	Message, Total, Headers
      result(
        Status.APIStatus.Ok,
        extracurricularActivities,
        "Tạo dữ liệu thành công",
        1,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Tạo dữ liệu thất bại", 0, null);
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
          "Not found any matched with id equal " + newData.id,
          0,
          null
        );
      }

      // Kiểm tra dữ liệu khóa ngoại roleId và schoolId có tồn tại
      var checkDataFK = await checkSchool(newData.schoolId);
      if (checkDataFK != null) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      // Gán giá trị cho dữ liệu
      extracurricularActivities = {
        id: newData.id,
        title: newData.title || dataCheck.recordset[0].title,
        location: newData.location || dataCheck.recordset[0].location,
        schoolId: newData.schoolId || dataCheck.recordset[0].schoolId,
        day: newData.day || dataCheck.recordset[0].day,
        time: newData.time || dataCheck.recordset[0].time,
        description: newData.description || dataCheck.recordset[0].description,
      };

      // Update dữ liệu
      dataUpdate = await model.update(extracurricularActivities);
      //Status, Data,	Message, Total, Headers
      result(
        Status.APIStatus.Ok,
        extracurricularActivities,
        "Cập nhật dữ liệu thành công",
        1,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, err, "Cập nhật dữ liệu thất bại", 0, null);
    }
  };

  this.getAllAdmin = async (id, schoolId, userId, offset, limit, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllAdmin({
        schoolId: schoolId, userId: userId, extraId: id,
        offset: offset,
        limit: limit
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
        "Get all successfull ",
        data.recordset.length,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, err, "Get all failed", 0, null);
    }
  };

  this.deleteAdmin = async (id, userId, result) => {
    try {
      // kiểm trả dữ liệu có tồn tại
      dataCheck = await model.getAllAdmin({ extraId: id, userId: userId });
      if (dataCheck.recordset.length === 0) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.NotFound,
          null,
          "Không tìm thấy dữ liệu",
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
        "Hiện đang có thông báo sử dụng hoạt động này",
        0,
        null
      );
    }
  };
};
