var Status = require("../common/core");
var Teacher = require("../models/Teacher");
var ClassSC = require("../models/Class");
var Grade = require("../models/Grade");
var Cources = require("../models/Cources");

var model = new ClassSC();
var modelTeacher = new Teacher();
var modelGrade = new Grade();

module.exports = function () {
  function validator(total, name, gradeId) {
    if (total && !(total % 1 === 0)) {
      return "Sai kiểu dữ liệu";
    }

    if (!name) {
      return "Vui lòng nhập tên lớp";
    }

    if (name && !(name % 1 === 0)) {
      return "Sai kiểu dữ liệu";
    }

    if (!gradeId) {
      return "Vui lòng nhập gradeId";
    }

    if (gradeId && !(gradeId % 1 === 0)) {
      return "Sai kiểu dữ liệu";
    }
    return null;
  }

  // Kiểm tra dữ liệu khóa chính
  const checkClass = async (id) => {
    try {
      data = await model.getOne(id);
      if (data.recordset.length !== 0) {
        return data.recordset[0];
      }
    } catch (err) {
      console.log(err);
    }
    return null;
  };

  // Kiểm tra dữ liệu khóa ngoại
  const checkTeacherAndCheckGrade = async (classId, teacherId, gradeId) => {
    try {
      // Kiểm tra khóa ngoại grade có tồn tại
      dataGrade = await modelGrade.getOne(gradeId);
      if (dataGrade.recordset.length == 0) {
        return "Không tìm thấy grade tương ứng";
      }

      // Kiểm tra khóa ngoại teacher có tồn tại
      if (teacherId != null) {
        dataTeacher = await modelTeacher.getAllManager({ teacherId: teacherId });
        if (dataTeacher.recordset.length == 0) {
          return "Không tìm thấy teacher tương ứng";
        }
        if (
          dataTeacher.recordset[0].schoolId !== dataGrade.recordset[0].schoolId
        ) {
          return "Giáo viên không thuộc cùng trường với khối được chọn";
        }

        dataClass = await model.getAllManager({ teacherId: teacherId });
        if (
          dataClass.recordset.length !== 0 &&
          classId != dataClass.recordset[0].id
        ) {
          return "Giáo viên đã có lớp chủ nhiệm";
        }

        dataCheckTeacherAndCheckGrade = await modelGrade.checkGradeIdAndTeacherId({ gradeId: gradeId, teacherId: teacherId });
        if (
          dataCheckTeacherAndCheckGrade.recordset.length === 0
        ) {
          return "Giáo viên và khối được chọn không cùng trường";
        }
      }
    } catch (err) {
      return "Sai kiểu dữ liệu";
    }
    return null;
  };

  this.createManager = async (newData, result) => {
    classSchool = {
      teacherId: newData.teacherId || null,
      gradeId: newData.gradeId || null,
      total: 0,
      name: newData.name || null,
    };

    var validate = validator(
      classSchool.total,
      classSchool.name,
      classSchool.gradeId
    );
    if (validate) {
      return result(Status.APIStatus.Invalid, null, validate, 0, null);
    }

    try {
      // Kiểm tra dữ liệu khóa ngoại roleId và schoolId có tồn tại
      var checkDataFK = await checkTeacherAndCheckGrade(
        null,
        classSchool.teacherId,
        classSchool.gradeId
      );
      if (checkDataFK) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      //Đổi tên class
      if (classSchool.name) {
        dataGrade = await modelGrade.getOne(classSchool.gradeId);
        classSchool.name = dataGrade.recordset[0].name.split("Khối lớp ")[1] + "/" + classSchool.name;
      }

      // Kiểm tra trùng tên lớp trong 1 trường
      dataCheck = await model.checkExist(classSchool.gradeId, classSchool.name);
      if (dataCheck.recordset.length != 0) {
        return result(Status.APIStatus.Invalid, null, "Tên lớp đã tồn tại", 0, null);
      }

      // Thêm dữ liệu
      dataCreate = await model.create(classSchool);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, classSchool, "Tạo thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
    }
  };

  this.updateManager = async (newData, result) => {
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

      var validate = validator(
        newData.total,
        newData.name.split("/")[1],
        newData.gradeId
      );
      if (validate) {
        return result(Status.APIStatus.Invalid, null, validate, 0, null);
      }

      // kiểm trả dữ liệu có tồn tại
      var dataCheck = await checkClass(newData.id);
      if (dataCheck == null) {
        return result(
          Status.APIStatus.Invalid,
          null,
          "Không tồn tại dữ liệu",
          0,
          null
        );
      }

      // Gán giá trị cho dữ liệu
      classSchool = {
        id: newData.id,
        teacherId: newData.teacherId || dataCheck.teacherId,
        gradeId: newData.gradeId || dataCheck.gradeId,
        total: dataCheck.total,
        name: newData.name || dataCheck.name,
      };

      // Kiểm tra dữ liệu khóa ngoại roleId và schoolId có tồn tại
      var checkDataFK = await checkTeacherAndCheckGrade(
        classSchool.id,
        classSchool.teacherId,
        classSchool.gradeId
      );
      if (checkDataFK) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      //Đổi tên class
      if (classSchool.name && classSchool.name != dataCheck.name) {
        dataGrade = await modelGrade.getOne(classSchool.gradeId);
        classSchool.name = dataGrade.recordset[0].name.split("Khối lớp ")[1] + "/" + classSchool.name.split("/")[1];
      }

      // Kiểm tra trùng tên lớp trong 1 trường
      dataCheck = await model.checkExist(classSchool.gradeId, classSchool.name);
      if (dataCheck.recordset.length != 0 && classSchool.name != newData.name) {
        return result(Status.APIStatus.Invalid, null, "Tên lớp đã tồn tại", 0, null);
      }

      // Update dữ liệu
      dataUpdate = await model.update(classSchool);


      model.updateTotal(classSchool.id);

      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, classSchool, "Cập nhật thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
    }
  };

  this.getAllManager = async (id, gradeId, teacherId, schoolId, offset, limit, className, result) => {
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
        gradeId: gradeId,
        teacherId: teacherId,
        schoolId: schoolId,
        classId: id,
        offset: offset,
        limit: limit,
        className: className
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
      result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
    }
  };

  this.deleteManager = async (id, result) => {
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
      dataCheck = await model.getAllManager({ classId: id });
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
      result(Status.APIStatus.Ok, null, "Xóa class thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
    }
  };


  this.createAdmin = async (newData, userId, result) => {
    classSchool = {
      teacherId: newData.teacherId || null,
      gradeId: newData.gradeId || null,
      total: 0,
      name: newData.name || null,
    };

    var validate = validator(
      classSchool.total,
      classSchool.name,
      classSchool.gradeId
    );
    if (validate) {
      return result(Status.APIStatus.Invalid, null, validate, 0, null);
    }

    try {
      // Kiểm tra dữ liệu khóa ngoại roleId và schoolId có tồn tại
      var checkDataFK = await checkTeacherAndCheckGrade(
        null,
        classSchool.teacherId,
        classSchool.gradeId
      );
      if (checkDataFK) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      dataCheckUser = await modelGrade.checkGradeIdAndTeacherId({ gradeId: classSchool.gradeId, teacherId: userId });
      if (
        dataCheckUser.recordset.length === 0
      ) {
        return result(Status.APIStatus.Invalid, null, "Giáo viên và khối được chọn không cùng trường", 0, null);
      }

      //Đổi tên class
      if (classSchool.name) {
        dataGrade = await modelGrade.getOne(classSchool.gradeId);
        classSchool.name = dataGrade.recordset[0].name.split("Khối lớp ")[1] + "/" + classSchool.name;
      }

      // Kiểm tra trùng tên lớp trong 1 trường
      dataCheck = await model.checkExist(classSchool.gradeId, classSchool.name);
      if (dataCheck.recordset.length != 0) {
        return result(Status.APIStatus.Invalid, null, "Tên lớp đã tồn tại", 0, null);
      }

      // Thêm dữ liệu
      dataCreate = await model.create(classSchool);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, classSchool, "Tạo thành công", 1, null);
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

      var validate = validator(
        newData.total,
        newData.name.split("/")[1],
        newData.gradeId
      );
      if (validate) {
        return result(Status.APIStatus.Invalid, null, validate, 0, null);
      }

      // kiểm trả dữ liệu có tồn tại
      var dataCheck = await checkClass(newData.id);
      if (dataCheck == null) {
        return result(
          Status.APIStatus.Invalid,
          null,
          "Không tồn tại dữ liệu",
          0,
          null
        );
      }

      // Gán giá trị cho dữ liệu
      classSchool = {
        id: newData.id,
        teacherId: newData.teacherId || dataCheck.teacherId,
        gradeId: newData.gradeId || dataCheck.gradeId,
        total: dataCheck.total,
        name: newData.name || dataCheck.name,
      };

      // Kiểm tra dữ liệu khóa ngoại roleId và schoolId có tồn tại
      var checkDataFK = await checkTeacherAndCheckGrade(
        classSchool.id,
        classSchool.teacherId,
        classSchool.gradeId
      );
      if (checkDataFK) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      dataCheckUser = await modelGrade.checkGradeIdAndTeacherId({ gradeId: classSchool.gradeId, teacherId: userId });
      if (
        dataCheckUser.recordset.length === 0
      ) {
        return result(Status.APIStatus.Invalid, null, "Giáo viên và khối được chọn không cùng trường", 0, null);
      }

      //Đổi tên class
      if (classSchool.name && classSchool.name != dataCheck.name) {
        dataGrade = await modelGrade.getOne(classSchool.gradeId);
        classSchool.name = dataGrade.recordset[0].name.split("Khối lớp ")[1] + "/" + classSchool.name.split("/")[1];
      }

      // Kiểm tra trùng tên lớp trong 1 trường
      dataCheck = await model.checkExist(classSchool.gradeId, classSchool.name);
      if (dataCheck.recordset.length != 0 && classSchool.name != newData.name) {
        return result(Status.APIStatus.Invalid, null, "Tên lớp đã tồn tại", 0, null);
      }

      // Update dữ liệu
      dataUpdate = await model.update(classSchool);


      model.updateTotal(classSchool.id);

      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, classSchool, "Cập nhật thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
    }
  };

  this.getAllAdmin = async (id, gradeId, teacherId, userId, offset, limit, className, result) => {
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
        gradeId: gradeId,
        teacherId: teacherId,
        classId: id,
        userId: userId,
        offset: offset,
        limit: limit,
        className: className
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
      result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
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
      dataCheck = await model.getAllAdmin({ classId: id, userId: userId });
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
      result(Status.APIStatus.Ok, null, "Xóa class thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
    }
  };

  this.resetTeacherManager = async (classId, gradeId, teacherId, schoolId, result) => {
    try {
      if (classId && !(classId % 1 === 0)) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Error,
          null,
          "Sai kiểu dữ liệu",
          0,
          null
        );
      }

      if (gradeId && !(gradeId % 1 === 0)) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Error,
          null,
          "Sai kiểu dữ liệu",
          0,
          null
        );
      }

      dataReset = await model.resetTeacher({
        classId: classId,
        gradeId: gradeId,
        teacherId: teacherId,
        schoolId: schoolId,
      });
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, null, "Cập dữ liệu thành công", 0, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Cập nhật thất bại", 0, null);
    }
  };

  this.resetTeacherAdmin = async (classId, gradeId, teacherId, userId, result) => {
    try {
      if (classId && !(classId % 1 === 0)) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Error,
          null,
          "Sai kiểu dữ liệu",
          0,
          null
        );
      }

      if (gradeId && !(gradeId % 1 === 0)) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Error,
          null,
          "Sai kiểu dữ liệu",
          0,
          null
        );
      }

      // kiểm trả dữ liệu có tồn tại
      dataCheck = await model.getAllAdmin({ classId: classId, gradeId: gradeId, teacherId: teacherId, userId: userId });
      if (dataCheck.recordset.length === 0) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.NotFound,
          null,
          "Không tồn tại hoặc dữ liệu không cùng trường học",
          0,
          null
        );
      }

      dataReset = await model.resetTeacher({
        classId: classId,
        gradeId: gradeId,
        teacherId: teacherId
      });
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, null, "Cập dữ liệu thành công", 0, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Cập nhật thất bại", 0, null);
    }
  };

  this.getAllTeacher = async (id, gradeId, userId, offset, limit, result) => {
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
      data = await model.getAllTeacher({
        gradeId: gradeId,
        classId: id,
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
      return result(
        Status.APIStatus.Ok,
        data.recordset,
        "Lấy dữ liệu thành công",
        data.recordset.length,
        null
      );

    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
    }
  };

};
