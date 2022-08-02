var Grade = require("../models/Grade");
var School = require("../models/School");
var Status = require("../common/core");

var model = new Grade();
var modelSchool = new School();

module.exports = function () {
  function validator(name) {
    if (!name) {
      //Status, Data,	Message, Total, Headers
      return "Bạn chưa nhập thông tin đầy đủ";
    }

    if (!(name % 1 === 0) || ![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].includes(Number(name))) {
      //Status, Message, Total, Headers
      return "Vui lòng chọn khối từ 1 đến 12";
    }
    return null;
  }

  // Kiểm tra dữ liệu khóa ngoại
  const checkSchool = async (schoolId, gradeName) => {
    try {
      // Kiểm tra khóa ngoại school có tồn tại
      if (schoolId != null) {
        dataSchool = await modelSchool.getOne(schoolId);
        if (dataSchool.recordset.length == 0) {
          return "Không tìm thấy school tương ứng";
        }
        dataGradeName = await model.checkNameWithSchoolId({gradeName: gradeName, schoolId: schoolId});
        if(dataGradeName.recordset.length != 0 ){
          return "Đã tồn tại " + gradeName.toLowerCase() + " cho trường";
        }
        if(dataSchool.recordset[0].type){
          switch (dataSchool.recordset[0].type) {
            case 1:
              if(('Khối lớp 1', 'Khối lớp 2', 'Khối lớp 3', 'Khối lớp 4', 'Khối lớp 5').includes(gradeName)) return null;
              break;
            case 2:
              if(('Khối lớp 6', 'Khối lớp 7', 'Khối lớp 8', 'Khối lớp 9').includes(gradeName)) return null;
              break;
            case 3:
              if(('Khối lớp 10', 'Khối lớp 11', 'Khối lớp 12').includes(gradeName)) return null;
              break;
          }
          return "Không được phép tạo khối học này"
        }
      }
    } catch (err) {
      return "Sai kiểu dữ liệu";
    }
    return null;
  }

  this.createManager = async (newData, userId, result) => {
    grade = {
      schoolId: newData.schoolId || null,
      name: newData.name || null
    };

    if(grade.name){
      var validate = validator(grade.name);
      if (validate != null) {
        return result(Status.APIStatus.Invalid, null, validate, 0, null);
      }
    }
    grade.name = "Khối lớp " + grade.name;

    try {
      // Kiểm tra dữ liệu khóa ngoại roleId và schoolId có tồn tại
      var checkDataFK = await checkSchool(
        grade.schoolId,
        grade.name
      );
      if (checkDataFK != null) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
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

  this.updateManager = async (newData, userId, result) => {
    try {
      // Kiểm tra kiểu dữ liệu và required của khóa chính
      if (!newData?.id || !(newData.id % 1 === 0)) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Error,
          null,
          "Bạn chưa nhập đúng thông tin khóa chính",
          0,
          null
        );
      }

      // kiểm tra kiểu dữ liệu có thuộc từ 1-12
      if (newData.name) {
        var validate = validator(newData.name);
        if (validate != null) {
          return result(Status.APIStatus.Invalid, null, validate, 0, null);
        }
      }
      newData.name = "Khối lớp " + newData.name;
      // kiểm trả dữ liệu grade có tồn tại
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

      // kiểm tra dữ liệu của khóa ngoại school có tồn tại
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
        id: newData.id,
        schoolId: newData.schoolId || dataCheck.recordset[0].schoolId,
        name: newData.name || dataCheck.recordset[0].name
      };

      // Kiểm tra dữ liệu khóa ngoại roleId và schoolId có tồn tại
      var checkDataFK = await checkSchool(
        grade.schoolId,
        grade.name
      );
      if (checkDataFK != null) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      // Update dữ liệu
      dataUpdate = await model.update(grade);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, grade, "Cập nhật thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, err, "Sai kiểu dữ liệu", 0, null);
    }
  };

  this.getAllManager = async (id, userId, schoolId, offset, limit, result) => {
    try {
      // Kiểm tra kiểu dữ liệu và required của khóa chính
      if (id && !(id % 1 === 0)) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Error,
          null,
          "Bạn chưa nhập đúng thông tin khóa chính",
          0,
          null
        );
      }
      // Lấy tất cả dữ liệu
      data = await model.getAllManager({
        schoolId: schoolId,
        gradeId: id,
        offset: offset,
        limit: limit
      });
      if (data.recordset.length === 0) {
        //Status, Data,	Message, Total, Headers
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
      result(Status.APIStatus.Error, err, "Sai kiểu dữ liệu", 0, null);
    }
  };

  this.deleteManager = async (id, userId, result) => {
    try {
      // Kiểm tra kiểu dữ liệu và required của khóa chính
      if (id && !(id % 1 === 0)) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Error,
          null,
          "Bạn chưa nhập đúng thông tin khóa chính",
          0,
          null
        );
      }
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
      return result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
    }
  };


  this.createAdmin = async (newData, userId, result) => {
    grade = {
      name: newData.name || null
    };

    var validate = validator(grade.name);
    if (validate != null) {
      return result(Status.APIStatus.Invalid, null, validate, 0, null);
    }
    grade.name = "Khối lớp " + grade.name;
    try {
      checkExited = await model.getAllAdmin({ userId: userId, gradeName: grade.name });
      if (checkExited.recordset.length !== 0) {
        return result(Status.APIStatus.Existed, null, "Tên khối đã tồn tại", 0, null);
      }

      grade.schoolId = await (await modelSchool.getSchoolIdFromTeacher({ userId: userId })).recordset[0].schoolId;

      // Kiểm tra dữ liệu khóa ngoại roleId và schoolId có tồn tại
      var checkDataFK = await checkSchool(
        grade.schoolId,
        grade.name
      );
      if (checkDataFK != null) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
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

  this.updateAdmin = async (newData, userId, result) => {
    try {
      // Kiểm tra kiểu dữ liệu và required của khóa chính
      if (!newData?.id || !(newData.id % 1 === 0)) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Error,
          null,
          "Bạn chưa nhập đúng thông tin khóa chính",
          0,
          null
        );
      }

      // kiểm tra kiểu dữ liệu có thuộc từ 1-12
      var validate = validator(newData.name);
      if (validate != null) {
        return result(Status.APIStatus.Invalid, null, validate, 0, null);
      }
      newData.name = "Khối lớp " + newData.name;
      // kiểm trả dữ liệu grade có tồn tại
      dataCheck = await model.getAllAdmin({ userId: userId, gradeId: newData.id });
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

      checkExited = await model.getAllAdmin({ userId: userId, gradeName: newData.name });
      if (checkExited.recordset.length !== 0) {
        return result(Status.APIStatus.Existed, null, "Tên khối đã tồn tại", 0, null);
      }

      // kiểm tra dữ liệu của khóa ngoại school có tồn tại
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
        id: newData.id,
        schoolId: newData.schoolId || dataCheck.recordset[0].schoolId,
        name: newData.name || dataCheck.recordset[0].name
      };

      // Kiểm tra dữ liệu khóa ngoại roleId và schoolId có tồn tại
      var checkDataFK = await checkSchool(
        grade.schoolId,
        grade.name
      );
      if (checkDataFK != null) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      // Update dữ liệu
      dataUpdate = await model.update(grade);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, grade, "Cập nhật thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
    }
  };

  this.getAllAdmin = async (id, userId, offset, limit, result) => {
    try {
      // Kiểm tra kiểu dữ liệu và required của khóa chính
      if (id && !(id % 1 === 0)) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Error,
          null,
          "Bạn chưa nhập đúng thông tin khóa chính",
          0,
          null
        );
      }
      // Lấy tất cả dữ liệu
      data = await model.getAllAdmin({
        gradeId: id, 
        userId: userId,
        offset: offset,
        limit: limit
      });
      if (data.recordset.length === 0) {
        //Status, Data,	Message, Total, Headers
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
      result(Status.APIStatus.Error, err, "Sai kiểu dữ liệu", 0, null);
    }
  };

  this.deleteAdmin = async (id, userId, result) => {
    try {
      // Kiểm tra kiểu dữ liệu và required của khóa chính
      if (id && !(id % 1 === 0)) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Error,
          null,
          "Bạn chưa nhập đúng thông tin khóa chính",
          0,
          null
        );
      }
      // kiểm trả dữ liệu có tồn tại
      dataCheck = await model.getAllAdmin({ userId: userId, gradeId: id });
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
      return result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
    }
  };
};
