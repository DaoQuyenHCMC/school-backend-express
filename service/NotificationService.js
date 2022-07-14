var Notification = require("../models/Notification");
var ExtracurricularActivities = require("../models/ExtracurricularActivities");
var Family = require("../models/Family");
var Student = require("../models/Student");
var School = require("../models/School");
var Role = require("../models/Role");
var Status = require("../common/core");
var Teacher = require("../models/Teacher");

var model = new Notification();
var modelExtracurricularActivities = new ExtracurricularActivities();
var modelSchool = new School();
var modelFamily = new Family();
var modelStudent = new Student();
var modelTeacher = new Teacher();

module.exports = function () {

  // Kiểm tra dữ liệu khóa ngoại
  const checkSchool = async (schoolId) => {
    try {
      // Kiểm tra khóa ngoại school có tồn tại
      if (schoolId != null) {
        dataSchool = await modelSchool.getOne(schoolId);
        if (dataSchool.recordset.length == 0) {
          return "Không tìm thấy school tương ứng";
        }
      }
    } catch (err) {
      return "Sai kiểu dữ liệu";
    }
    return null;
  }

  const checkStatus = async (status) => {
    // Kiểm tra khóa ngoại school có tồn tại
    if (status && (status === 'WAIT' || status === 'APPROVE'
      || status === 'IGNORE' || status === 'CANCEL')) {
      return true;
    }
    return false;
  }

  const checkObject = async (object, userId, role) => {
    if (object) {
      // Kiểm tra khóa ngoại school có tồn tại
      if (object == 1 || object == 2 || object == 3 || 
        object == 5 || object == 6 || object == 7) {
        //Status, Message, Total, Headers
        return true;
      }
      if (role == 1) { // admin
        const dataStudent = await modelStudent.getAllAdmin({ studentId: object, userId: userId });
        const dataTeacher = await modelTeacher.getAllAdmin({ teacherId: object, userId: userId });
        if (dataStudent.recordset.length != 0 || dataTeacher.recordset.length != 0) return true;
      }
      if (role == 2) { // manager
        const dataStudent = await modelStudent.getAllManager({ studentId: object });
        const dataTeacher = await modelTeacher.getAllManager({ teacherId: object });
        if (dataStudent.recordset.length != 0 || dataTeacher.recordset.length != 0) return true;
      }
    }

    return false;
  }

  this.getAll = async (id, extracurricularActivitiesId, schoolId, result) => {
    try {
      data = await model.getAll({ extracurricularActivitiesId: extracurricularActivitiesId, schoolId: schoolId, notificationId: id });
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
      result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
    }
  };

  this.createManager = async (newData, userId, result) => {
    notification = {
      schoolId: newData.schoolId,
      title: newData.title,
      description: newData.description,
      extracurricularActivitiesId: newData.extracurricularActivitiesId || null,
      object: newData.object || '5',
      startDay: newData.startDay,
      endDay: newData.endDay,
      status: 'APPROVE',
      createBy: userId 
    };
    try {
      if (notification.extracurricularActivitiesId) {
        dataExtracurricularActivities =
          await modelExtracurricularActivities.getOne(
            notification.extracurricularActivitiesId
          );
        if (dataExtracurricularActivities.recordset.length == 0) {
          return result(
            Status.APIStatus.NotFound,
            null,
            "Không tìm thấy dữ liệu tương ứng",
            0,
            null
          );
        }
      }

      // Kiểm tra dữ liệu khóa ngoại roleId và schoolId có tồn tại
      var checkDataFK = await checkSchool(notification.schoolId);
      if (checkDataFK != null) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }
      // Kiểm tra đối tượng 
      var checkObjectData = await checkObject(notification.object, userId, 2);
      if (!checkObjectData) {
        return result(Status.APIStatus.Invalid, null, "Sai dữ liệu của đối tượng được thông báo", 0, null);
      }
      // Thêm dữ liệu
      dataCreate = await model.create(notification);
      //Status, Data,	Message, Total, Headers
      result(
        Status.APIStatus.Ok,
        notification,
        "Tạo dữ liệu thành công",
        1,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
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
      dataCheck = await model.getAllManager({ notificationId: newData.id });
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
      // Kiểm tra dữ liệu khóa ngoại roleId và schoolId có tồn tại
      var checkDataFK = await checkSchool(
        newData.schoolId
      );
      if (checkDataFK != null) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }
      // Kiểm tra đối tượng
      if (newData.object) {
        var checkObjectData = await checkObject(newData.object, userId, 2);
        if (!checkObjectData) {
          return result(Status.APIStatus.Invalid, null, "Sai dữ liệu của đối tượng được thông báo", 0, null);
        }
      }
      if (newData.status) {
        newData.status = newData.status.toUpperCase();
        var checkDataStatus = await checkStatus(newData.status);
        if (!checkDataStatus) {
          return result(Status.APIStatus.Invalid, null, "Sai dữ liệu cho trạng thái của thông báo", 0, null);
        }
      }
      // Gán giá trị cho dữ liệu
      notification = {
        id: newData.id,
        schoolId: newData.schoolId || dataCheck.recordset[0].schoolId,
        title: newData.title || dataCheck.recordset[0].title,
        description: newData.description || dataCheck.recordset[0].description,
        extracurricularActivitiesId:
          newData.extracurricularActivitiesId ||
          dataCheck.recordset[0].extracurricularActivitiesId,
        status: newData.status ||
          dataCheck.recordset[0].status,
        object: newData.object || dataCheck.recordset[0].object,
        startDay: newData.startDay || dataCheck.recordset[0].startDay,
        endDay: newData.endDay || dataCheck.recordset[0].endDay
      };

      // Update dữ liệu
      dataUpdate = await model.update(notification);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, notification, "Cập nhật dữ liệu thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, err, "Cập nhật dữ liệu thất bại", 0, null);
    }
  };

  this.getAllManager = async (id, extracurricularActivitiesId, schoolId, status, offset, limit, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllManager({
        extracurricularActivitiesId: extracurricularActivitiesId,
        status: status,
        schoolId: schoolId,
        notificationId: id,
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
      result(Status.APIStatus.Error, null, "Lấy dữ liệu thất bại", 0, null);
    }
  };

  this.deleteManager = async (id, result) => {
    try {
      // kiểm trả dữ liệu có tồn tại
      dataCheck = await model.getOne(id);
      if (dataCheck.recordset.length === 0) {
        //Status, Data,	Message, Total, Headers
        return result(Status.APIStatus.NotFound, null, "Không tìm thấy dữ liệu với định danh " + id, 0, null);
      }
      // xóa dữ liệu
      dataDelete = await model.delete(id);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, null, "Xóa thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, null, "Xóa thất bại", 0, null);
    }
  };

  this.createAdmin = async (newData, userId, result) => {
    notification = {
      title: newData.title,
      description: newData.description,
      extracurricularActivitiesId: newData.extracurricularActivitiesId,
      startDay: newData.startDay || Date.now(),
      endDay: newData.endDay || Date.now(),
      createBy: userId || null,
      approveBy: "MANAGER",
      object: newData.object || '3'
    };
    try {
      if (notification.extracurricularActivitiesId) {
        dataExtracurricularActivities =
          await modelExtracurricularActivities.getAllAdmin({ extraId: newData.extracurricularActivitiesId, userId: userId });
        if (dataExtracurricularActivities.recordset.length == 0) {
          return result(Status.APIStatus.NotFound, null, "Không tìm thấy hoạt động yêu cầu", 0, null);
        }
      }

      // Kiểm tra đối tượng 
      var checkObjectData = await checkObject(notification.object, userId, 1);
      if (!checkObjectData) {
        return result(Status.APIStatus.Invalid, null, "Sai dữ liệu của đối tượng được thông báo", 0, null);
      }

      notification.schoolId = notification.schoolId = await (await modelSchool.getSchoolIdFromTeacher({ userId: userId })).recordset[0].schoolId;
      // Thêm dữ liệu
      dataCreate = await model.create(notification);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, notification, "Tạo dữ liệu thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Tạo dữ liệu thất bại", 0, null);
    }
  };

  this.createStudent = async (newData, userId, result) => {
    notification = {
      title: newData.title || null,
      description: newData.description,
      extracurricularActivitiesId: newData.extracurricularActivitiesId || null,
      startDay: newData.startDay || Date.now(),
      endDay: newData.endDay || Date.now(),
      createBy: userId || null,
      approveBy: ["TEACHER", "ADMIN"].includes(newData?.approveBy?.toUpperCase()) ? newData.approveBy.toUpperCase() : 'ADMIN',
      object: userId,
    };
    try {
      if (notification.extracurricularActivitiesId) {
        dataExtracurricularActivities =
          await modelExtracurricularActivities.getAllAdmin({ extraId: newData.extracurricularActivitiesId, userId: userId });
        if (dataExtracurricularActivities.recordset.length == 0) {
          return result(Status.APIStatus.NotFound, null, "Không tìm thấy hoạt động yêu cầu", 0, null);
        }
      }
      notification.schoolId = await (await modelSchool.getSchoolIdFromStudent({ studentId: userId })).recordset[0].schoolId;
      // Thêm dữ liệu
      dataCreate = await model.create(notification);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, notification, "Tạo dữ liệu thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Tạo dữ liệu thất bại", 0, null);
    }
  };

  this.createFamily = async (newData, userId, result) => {
    notification = {
      title: newData.title,
      description: newData.description,
      startDay: newData.startDay || Date.now(),
      endDay: newData.endDay || Date.now(),
      createBy: userId,
      approveBy: ["TEACHER", "ADMIN"].includes(newData?.approveBy?.toUpperCase()) ? newData.approveBy.toUpperCase() : 'ADMIN',
      object: userId,
    };
    try {
      // Thêm dữ liệu
      dataCreate = await model.create(notification);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, notification, "Tạo dữ liệu thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Tạo dữ liệu thất bại", 0, null);
    }
  };

  this.createTeacherHomeroom = async (newData, userId, result) => {
    notification = {
      title: newData.title,
      description: newData.description,
      extracurricularActivitiesId: newData.extracurricularActivitiesId,
      startDay: newData.startDay || Date.now(),
      endDay: newData.endDay || Date.now(),
      createBy: userId,
      approveBy: "ADMIN",
      object: newData.object || userId
    };
    try {
      if (notification.object != userId) {
        dataObjectStudent = await modelStudent.getAllTeacherHomeroom({ studentId: notification.object, userId: userId });
        if (dataObjectStudent.recordset.length == 0) {
          return result(
            Status.APIStatus.NotFound,
            null,
            "Đối tượng gửi đến không thuộc quyền quản lý",
            0,
            null
          );
        }
        notification.status = 'APPROVE';
      }
      if (notification.extracurricularActivitiesId != null) {
        dataExtracurricularActivities =
          await modelExtracurricularActivities.getAllAdmin({ extraId: newData.extracurricularActivitiesId, userId: userId });
        if (dataExtracurricularActivities.recordset.length == 0) {
          return result(Status.APIStatus.NotFound, null, "Không tìm thấy hoạt động yêu cầu", 0, null);
        }
      }
      notification.schoolId = notification.schoolId = await (await modelSchool.getSchoolIdFromTeacher({ userId: userId })).recordset[0].schoolId;
      // Thêm dữ liệu
      await model.create(notification);
      // Thêm dữ liệu
      dataFamily = await modelStudent.getFamilyByStudent({ studentId: notification.object });
      if (dataFamily.recordset.length != 0) {
        notification.status = 'APPROVE';
        notification.object = await dataFamily.recordset[0].CMND;
        if (notification.object) await model.create(notification);
      }
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, notification, "Tạo dữ liệu thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Tạo dữ liệu thất bại", 0, null);
    }
  };

  this.createTeacherListHomeroom = async (newData, userId, result) => {
    try {
      dataStudent = await modelStudent.getAllTeacherHomeroom({
        userId: userId,
      });
      if (dataStudent.recordset.length === 0) {
        //Status, Data,	Message, Total, Headers
        return result(Status.APIStatus.Ok, null, "Danh sách rỗng", 0, null);
      }
      for (let index = 0; index < dataStudent.recordset.length; index++) {
        notification = {
          title: newData.title,
          description: newData.description,
          extracurricularActivitiesId: newData.extracurricularActivitiesId,
          startDay: newData.startDay || Date.now(),
          endDay: newData.endDay || Date.now(),
          createBy: userId,
          approveBy: "ADMIN",
          object: dataStudent.recordset[index].id,
          status: 'APPROVE'
        };

        notification.schoolId = notification.schoolId = await (await modelSchool.getSchoolIdFromTeacher({ userId: userId })).recordset[0].schoolId;
        // Thêm dữ liệu
        await model.create(notification);
        // Thêm dữ liệu
        dataFamily = await modelStudent.getFamilyByStudent({ studentId: notification.object });
        if (dataFamily.recordset.length != 0) {
          notification.object = await dataFamily.recordset[0].CMND;
          if (notification.object) await model.create(notification);
        }
      }
      return result(
        Status.APIStatus.Ok,
        null,
        "Tạo dữ liệu thành công",
        0,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Tạo dữ liệu thất bại", 0, null);
    }
  };


  this.createTeacher = async (newData, userId, result) => {
    try {
      if(!newData.classId || !newData.courseId){
        return result(
          Status.APIStatus.Invalid,
          null,
          "Vui lòng truyền đầy đủ thông tin lớp học và khóa học",
          0,
          null
        );
      }
      dataStudent = await modelStudent.getAllTeacherCourse({
        userId: userId,
        classId: newData.classId,
        courseId: newData.courseId
      });
      if (dataStudent.recordset.length === 0) {
        //Status, Data,	Message, Total, Headers
        return result(Status.APIStatus.Ok, null, "Danh sách rỗng", 0, null);
      }
      for (let index = 0; index < dataStudent.recordset.length; index++) {
        notification = {
          title: newData.title,
          description: newData.description,
          extracurricularActivitiesId: newData.extracurricularActivitiesId,
          startDay: newData.startDay || Date.now(),
          endDay: newData.endDay || Date.now(),
          createBy: userId,
          approveBy: "ADMIN",
          object: dataStudent.recordset[index].id,
          status: 'APPROVE'
        };

        notification.schoolId = notification.schoolId = await (await modelSchool.getSchoolIdFromTeacher({ userId: userId })).recordset[0].schoolId;
        // Thêm dữ liệu
        await model.create(notification);
        // Thêm dữ liệu
        dataFamily = await modelStudent.getFamilyByStudent({ studentId: notification.object });
        if (dataFamily.recordset.length != 0) {
          notification.object = await dataFamily.recordset[0].CMND;
          if (notification.object) await model.create(notification);
        }
      }
      return result(
        Status.APIStatus.Ok,
        null,
        "Tạo dữ liệu thành công",
        0,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Tạo dữ liệu thất bại", 0, null);
    }
  };

  this.createTeacherCourse = async (newData, userId, result) => {
    notification = {
      title: newData.title,
      description: newData.description,
      extracurricularActivitiesId: newData.extracurricularActivitiesId,
      startDay: newData.startDay || Date.now(),
      endDay: newData.endDay || Date.now(),
      createBy: userId,
      approveBy: "ADMIN",
      object: newData.object || userId
    };
    try {
      if (notification.object != userId) {
        dataObjectStudent = await modelStudent.getAllTeacherCourse({ userId: userId, studentId: newData.object });
        if (dataObjectStudent.recordset.length == 0) {
          return result(
            Status.APIStatus.NotFound,
            null,
            "Đối tượng gửi đến không thuộc quyền quản lý",
            0,
            null
          );
        }
        notification.status = 'APPROVE';
      }

      if (notification.extracurricularActivitiesId != null) {
        dataExtracurricularActivities =
          await modelExtracurricularActivities.getAllAdmin({ extraId: newData.extracurricularActivitiesId, userId: userId });
        if (dataExtracurricularActivities.recordset.length == 0) {
          return result(Status.APIStatus.NotFound, null, "Không tìm thấy hoạt động yêu cầu", 0, null);
        }
      }
      notification.schoolId = notification.schoolId = await (await modelSchool.getSchoolIdFromTeacher({ userId: userId })).recordset[0].schoolId;
      // Thêm dữ liệu
      await model.create(notification);
      // Thêm dữ liệu
      dataFamily = await modelStudent.getFamilyByStudent({ studentId: notification.object });
      if (dataFamily.recordset.length != 0) {
        notification.status = 'APPROVE';
        notification.object = await dataFamily.recordset[0].CMND;
        if (notification.object) await model.create(notification);
      }
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, null, "Tạo dữ liệu thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Tạo dữ liệu thất bại", 0, null);
    }
  };

  this.updateAdmin = async (newData, userId, result) => {
    if (!newData?.id) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, null, "Bạn chưa nhập đầy đủ thông tin", 0, null);
    }
    try {
      // kiểm trả dữ liệu có tồn tại
      dataCheck = await model.getAllAdmin({ notifId: newData.id, userId: userId });
      if (dataCheck.recordset.length === 0) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.NotFound,
          null,
          "Không tìm thấy dữ liệu hoặc không có quyền",
          0,
          null
        );
      }

      // kiểm tra dữ liệu của khóa ngoại có tồn tại
      if (newData.extracurricularActivitiesId != null) {
        dataExtracurricularActivities =
          await modelExtracurricularActivities.getAllAdmin({ extraId: newData.extracurricularActivitiesId, userId: userId });
        if (dataExtracurricularActivities.recordset.length == 0) {
          return result(
            Status.APIStatus.NotFound,
            null,
            "Không tìm thấy hoạt động yêu cầu ",
            0,
            null
          );
        }
      }

      // Kiểm tra dữ liệu khóa ngoại roleId và schoolId có tồn tại
      var checkDataFK = await checkSchool(
        newData.schoolId
      );
      if (checkDataFK != null) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      // Kiểm tra đối tượng
      if (newData.object) {
        var checkObjectData = await checkObject(newData.object, userId, 1);
        if (!checkObjectData) {
          return result(Status.APIStatus.Invalid, null, "Sai dữ liệu của đối tượng được thông báo", 0, null);
        }
      }

      // Gán giá trị cho dữ liệu

      notification = {
        id: newData.id,
        schoolId: newData.schoolId || dataCheck.recordset[0].schoolId,
        title: newData.title || dataCheck.recordset[0].title,
        description: newData.description || dataCheck.recordset[0].description,
        extracurricularActivitiesId: newData.extracurricularActivitiesId ||
          dataCheck.recordset[0].extracurricularActivitiesId,
        status: dataCheck.recordset[0].statusNotification,
        startDay: newData.startDay || dataCheck.recordset[0].startDay,
        endDay: newData.endDay || dataCheck.recordset[0].endDay,
        object: newData.object || dataCheck.recordset[0].object,
        approveBy: ["TEACHER", "ADMIN"].includes(newData?.approveBy?.toUpperCase()) ? newData.approveBy.toUpperCase() : dataCheck.recordset[0].object,
      };

      // Update dữ liệu
      dataUpdate = await model.update(notification);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, notification, "Cập nhật thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Cập nhật thất bại", 0, null);
    }
  };

  this.approveAdmin = async (id, approve, userId, result) => {
    try {
      // kiểm trả dữ liệu có tồn tại
      dataCheck = await model.getAllAdmin({ notificationId: id, userId: userId, approveBy: "ADMIN" });
      if (dataCheck.recordset.length === 0 || !approve || !id || !["APPROVE", "WAIT", "CANCEL"].includes(approve.toUpperCase())) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.NotFound,
          null,
          "Không tìm thấy dữ liệu hoặc không có quyền",
          0,
          null
        );
      }
      await model.approve(approve.toUpperCase(), id);

      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Ok, null, "Cập nhật thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
    }
  };

  this.approveTeacher = async (id, approve, userId, result) => {
    try {
      // kiểm trả dữ liệu có tồn tại
      dataCheck = await model.getAllAdmin({ notificationId: id, userId: userId, approveBy: "TEACHER" });
      if (dataCheck.recordset.length === 0 || !approve || !id || !["APPROVE", "WAIT", "CANCEL"].includes(approve.toUpperCase())) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.NotFound,
          null,
          "Không tìm thấy dữ liệu hoặc không có quyền",
          0,
          null
        );
      }
      await model.approve(approve.toUpperCase(), id);

      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Ok, null, "Cập nhật thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
    }
  };

  this.approveManager = async (id, approve, userId, result) => {
    try {
      // kiểm trả dữ liệu có tồn tại
      dataCheck = await model.getAllManager({ notificationId: id, userId: userId });
      if (dataCheck.recordset.length === 0 || !approve || !id || !["APPROVE", "WAIT", "CANCEL"].includes(approve.toUpperCase())) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.NotFound,
          null,
          "Không tìm thấy dữ liệu hoặc không có quyền",
          0,
          null
        );
      }
      await model.approve(approve.toUpperCase(), id);

      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Ok, null, "Cập nhật thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
    }
  };

  this.getAllAdmin = async (id, extracurricularActivitiesId, schoolId, userId, offset, limit, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllAdmin({
        extracurricularActivitiesId: extracurricularActivitiesId,
        schoolId: schoolId,
        notificationId: id,
        userId: userId,
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
        "Lấy dữ liệu thành công",
        data.recordset.length,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
    }
  };

  this.getAllStudent = async (id, extracurricularActivitiesId, schoolId, userId, status, offset, limit, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllStudent({
        extracurricularActivitiesId: extracurricularActivitiesId,
        schoolId: schoolId,
        notificationId: id,
        userId: userId,
        status: status,
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
        "Lấy dữ liệu thành công",
        data.recordset.length,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
    }
  };

  this.getAllFamily = async (id, extracurricularActivitiesId, userId, status, offset, limit, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllFamily({
        extracurricularActivitiesId: extracurricularActivitiesId,
        offset: offset,
        limit: limit,
        notificationId: id,
        userId: userId,
        status: status
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
        "Lấy dữ liệu thành công",
        data.recordset.length,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
    }
  };

  this.getAllStudentRequest = async (id, extracurricularActivitiesId, userId, status, offset, limit, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllStudentRequest({
        extracurricularActivitiesId: extracurricularActivitiesId,
        offset: offset,
        limit: limit,
        notificationId: id,
        userId: userId,
        status: status
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
        "Lấy dữ liệu thành công",
        data.recordset.length,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
    }
  };

  this.getAllFamilyRequest = async (id, extracurricularActivitiesId, userId, status, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllFamilyRequest({ extracurricularActivitiesId: extracurricularActivitiesId, notificationId: id, userId: userId, status: status });
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
        "Lấy dữ liệu thành công",
        data.recordset.length,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
    }
  };

  this.getAllForAdmin = async (id, extracurricularActivitiesId, schoolId, userId, offset, limit, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllForAdmin({
        extracurricularActivitiesId: extracurricularActivitiesId,
        schoolId: schoolId,
        notificationId: id,
        userId: userId,
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
        "Lấy dữ liệu thành công",
        data.recordset.length,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
    }
  };

  this.getAllTeacher = async (id, extracurricularActivitiesId, userId, status, offset, limit, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllTeacher({
        extracurricularActivitiesId: extracurricularActivitiesId,
        offset: offset,
        limit: limit,
        notificationId: id,
        userId: userId,
        status: status
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
        "Lấy dữ liệu thành công",
        data.recordset.length,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
    }
  };

  this.getAllTeacherRequest = async (id, extracurricularActivitiesId, userId, status, offset, limit, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllTeacherRequest({
        extracurricularActivitiesId: extracurricularActivitiesId,
        offset: offset,
        limit: limit,
        notificationId: id,
        userId: userId,
        status: status
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
        "Lấy dữ liệu thành công",
        data.recordset.length,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
    }
  };

  this.getAllRequestAdmin = async (userId, status, purpose, offset, limit, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllRequestAdmin({
        userId: userId,
        status: status,
        purpose: purpose,
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
        "Lấy dữ liệu thành công",
        data.recordset.length,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
    }
  };

  this.getAllRequestAdminFromTeacher = async (userId, status, offset, limit, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllRequestAdminFromTeacher({
        userId: userId,
        status: status,
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
        "Lấy dữ liệu thành công",
        data.recordset.length,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
    }
  };

  this.getAllRequestAdminFromStudent = async (userId, status, offset, limit, result) => {
    try {
      // Lấy tất cả dữ liệu
      data = await model.getAllRequestAdminFromStudent({
        userId: userId,
        status: status,
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
        "Lấy dữ liệu thành công",
        data.recordset.length,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
    }
  };

  this.deleteAdmin = async (id, userId, result) => {
    try {
      // kiểm trả dữ liệu có tồn tại
      dataCheck = await model.getAllAdmin({ userId: userId, notifId: id });
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
        1,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(
        Status.APIStatus.Error,
        null,
        "Lỗi. Vui lòng thử lại",
        0,
        null
      );
    }
  };

  this.createCustomer = async (newData, userId, result) => {
    notification = {
      schoolId: newData.schoolId,
      title: newData.title,
      description: newData.description
    };
    try {
      // Kiểm tra dữ liệu khóa ngoại roleId và schoolId có tồn tại
      var checkDataFK = await checkSchool(
        notification.schoolId
      );
      if (checkDataFK != null) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      // Thêm dữ liệu
      dataCreate = await model.create(notification);
      //Status, Data,	Message, Total, Headers
      result(
        Status.APIStatus.Ok,
        notification,
        "Gửi khiếu nại thành công",
        1,
        null
      );
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Gửi dữ liệu thất bại", 0, null);
    }
  };
};
