var ExtracurricularActivities = require("../models/ExtracurricularActivities");
var Notification = require("../models/Notification");
var Status = require("../common/core");

var modelNotification = new Notification();

var model = new ExtracurricularActivities();

module.exports = function () {
  this.create = async (newData, result) => {

    // Gán dữ liệu
    extracurricularActivities = {
      location: newData.location || null,
      day: newData.day || null,
      time: newData.time || null,
      description: newData.description || null,
      createDay: Date.now(),
      updateDay: Date.now(),
    };


    try {
      // Thêm dữ liệu
      dataCreate = await model.create(extracurricularActivities);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, extracurricularActivities, "Create successfullt ", 1, null);

    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Update failed", 0, null);
    }
  };

  this.update = async (newData, result) => {
    if (!newData?.id) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, null, "Bạn chưa nhập đầy đủ thông tin", 0, null);
    }
    try {
      // kiểm trả dữ liệu có tồn tại
      dataCheck = await model.getOne(newData.id);
      if (dataCheck.recordset.length === 0) {
        //Status, Data,	Message, Total, Headers
        return result(Status.APIStatus.NotFound, null, "Not found any matched with id equal " + newData.id, 0, null);
      }

      // Gán giá trị cho dữ liệu
      extracurricularActivities = {
        id: newData.id,
        location: newData.location || dataCheck.recordset[0].location,
        day: newData.day || dataCheck.recordset[0].day,
        time: newData.time || dataCheck.recordset[0].time,
        description: newData.description || dataCheck.recordset[0].description,
        createDay: dataCheck.recordset[0].createDay,
        updateDay: Date.now()
      };

      // Update dữ liệu
      dataUpdate = await model.update(extracurricularActivities)
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, extracurricularActivities, "Update successfull ", 1, null);

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
          return result(Status.APIStatus.NotFound, null, "Not found any matched with id equal " + id, 0, null)
        }
        //Status, Data,	Message, Total, Headers
        result(Status.APIStatus.Ok, data.recordset, "Get data successfull ", data.recordset.length, null);
      }
      if (!id) {
        // Lấy tất cả dữ liệu
        data = await model.getAll();
        //Status, Data,	Message, Total, Headers
        result(Status.APIStatus.Ok, data.recordset, "Get all successfull ", data.recordset.length, null);
      }

    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, err, "Get all failed", 0, null);
    }
  };

  this.delete = async (id, result) => {
    try {
      // kiểm trả dữ liệu có tồn tại
      dataCheck = await model.getOne(id);
      if (dataCheck.recordset.length === 0) {
        //Status, Data,	Message, Total, Headers
        return result(Status.APIStatus.NotFound, null, "Not found any matched with id equal " + id, 0, null);
      }

      // Lấy những dữ liệu tham chiếu tới bảng
      dataNotification = await modelNotification.getByExtracurricularActivitiesId(id);

      dataNotification.recordset.forEach(async (element) => {
        //xóa dữ liệu của khóa ngoại
        await modelNotification.delete(element.id);
      });
      // xóa dữ liệu
      dataDelete = await model.delete(id);

      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, null, "Delete extracurricular activities successfull", 0, null);

    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, null, "Delete extracurricular activities failed", 0, null);
    }
  };
};
