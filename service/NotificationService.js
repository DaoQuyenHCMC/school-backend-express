var Notification = require("../models/Notification");
var ExtracurricularActivities = require("../models/ExtracurricularActivities");
var Status = require("../common/core");


var model = new Notification();
var modelExtracurricularActivities = new  ExtracurricularActivities();

module.exports = function () {
  this.create = async (newData, result) => {
    notification = {
      title: newData.title || null,
      description: newData.description || null,
      extracurricularActivitiesId: newData.extracurricularActivitiesId || null,
      createDay: Date.now(),
      updateDay: Date.now(),
    };
    try {
      if (notification.extracurricularActivitiesId != null) {
        dataExtracurricularActivities =
          await modelExtracurricularActivities.getOne(
            notification.extracurricularActivitiesId
          );
        if (dataExtracurricularActivities.recordset.length == 0) {
          return result(
            Status.APIStatus.NotFound,
            null,
            "Not found any matched extracurricular activities with id equal " +
              notification.extracurricularActivitiesId,
            0,
            null
          );
        }
      }
      // Thêm dữ liệu
      dataCreate = await model.create(notification);
      //Status, Data,	Message, Total, Headers
      result(
        Status.APIStatus.Ok,
        notification,
        "Create successfullt ",
        1,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Create failed", 0, null);
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
          "Not found any matched notification with id equal " + newData.id,
          0,
          null
        );
      }

      // kiểm tra dữ liệu của khóa ngoại có tồn tại
      if (newData.extracurricularActivitiesId != null) {
        dataExtracurricularActivities =
          await modelExtracurricularActivities.getOne(
            newData.extracurricularActivitiesId
          );
        if (dataExtracurricularActivities.recordset.length == 0) {
          return result(
            Status.APIStatus.NotFound,
            null,
            "Not found any matched extracurricular activities with id equal " +
              newData.extracurricularActivitiesId,
            0,
            null
          );
        }
      }

      // Gán giá trị cho dữ liệu

      notification = {
        id: newData.id,
        title: newData.title || dataCheck.recordset[0].title,
        description: newData.description || dataCheck.recordset[0].description,
        extracurricularActivitiesId:
          newData.extracurricularActivitiesId ||
          dataCheck.recordset[0].extracurricularActivitiesId,
        createDay: dataCheck.recordset[0].createDay,
        updateDay: Date.now(),
      };

      // Update dữ liệu
      dataUpdate = await model.update(notification);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, notification, "Update successfull ", 1, null);
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
            "Not found any matched with id equal " + id,
            0,
            null
          );
        }
        //Status, Data,	Message, Total, Headers
        result(
          Status.APIStatus.Ok,
          data.recordset,
          "Get data successfull ",
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
          "Get all successfull ",
          data.recordset.length,
          null
        );
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
        return result(
          Status.APIStatus.NotFound,
          null,
          "Not found any matched with id equal " + id,
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
        "Delete notification successfull",
        1,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Error,
        null,
        "Delete notification failed",
        0,
        null
      );
    }
  };
};
