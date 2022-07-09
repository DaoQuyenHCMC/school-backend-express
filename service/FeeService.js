var Fee = require("../models/Fee");
var ContactBook = require("../models/ContactBook");
var Student = require("../models/Student");
var ClassSC = require("../models/Class");
var Status = require("../common/core");
const School = require("../models/School");

var model = new Fee();
var modelSchool = new School();
var modelContactBook = new ContactBook();
var modelStudent = new Student();

module.exports = function () {
  // Kiểm tra dữ liệu khóa ngoại
  const checkContactBook = async (contactBookId) => {
    try {
      // Kiểm tra khóa ngoại role có tồn tại
      if (contactBookId != null) {
        dataContactBook = await modelContactBook.getOne(contactBookId);
        if (dataContactBook.recordset.length == 0) {
          return "Không tìm thấy contact book tương ứng";
        }
      }
    } catch (err) {
      return "Sai kiểu dữ liệu";
    }
    return null;
  };

  // Thêm
  this.createManager = async (newData, result) => {
    // Gán dữ liệu
    fee = {
      contactBookId: newData.contactBookId || null,
      dateFee: newData.dateFee || null,
      tuitionFee: newData.tuitionFee || null,
    };

    try {
      // Kiểm tra dữ liệu khóa ngoại có tồn tại
      var checkDataFK = await checkContactBook(fee.contactBookId);
      if (checkDataFK != null) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      dataCheck = await model.getAll({ contactBookId: fee.contactBookId });
      if (dataCheck.recordset.length != 0) {
        return result(Status.APIStatus.Invalid, null, "Đã tồn tại học phí", 0, null);
      }

      // Thêm dữ liệu
      dataCreate = await model.create(fee);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, fee, "Tạo dữ liệu thành công", 1, null);
    } catch (err) {
      console.log(err);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Tạo dữ liệu thất bại", 0, null);
    }
  };

  this.createListManager = async (newData, result) => {
    try {
      if (!newData.schoolYear || !newData.semester || !newData.gradeId) {
        //Status, Data,	Message, Total, Headers
        return result(Status.APIStatus.Ok, null, "Thiếu dữ liệu", 0, null);
      }

      if (!(newData.semester === "HK I" || newData.semester === "HK II")) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Invalid,
          null,
          "Sai thông tin học kỳ",
          0,
          null
        );
      }

      if (!(newData.schoolYear % 1 === 0)) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Invalid,
          null,
          "Sai thông tin year",
          0,
          null
        );
      }

      dataContactBook = await modelContactBook.getByYearSemesterGrade(
        newData.schoolYear,
        newData.semester,
        newData.gradeId
      );
      if (dataContactBook.recordset.length === 0) {
        //Status, Data,	Message, Total, Headers
        return result(Status.APIStatus.Ok, null, "Danh sách rỗng", 0, null);
      }

      for (let index = 0; index < dataContactBook.recordset.length; index++) {
        fee = {
          contactBookId: dataContactBook.recordset[index].id || null,
          dateFee: newData.dateFee || null,
          tuitionFee: newData.tuitionFee || null,
        };

        dataCheck = await model.getAll({ contactBookId: fee.contactBookId });
        if (dataCheck.recordset.length != 0) {
          continue;
        }

        // Thêm dữ liệu
        dataCreate = await model.create(fee);
      }
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, fee, "Tạo dữ liệu thành công", 1, null);
    } catch (err) {
      console.log(err);
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
      var dataCheck = await model.getOne(newData.id);
      if (dataCheck.recordset.length === 0) {
        return result(
          Status.APIStatus.Invalid,
          null,
          "Không tồn tại dữ liệu",
          0,
          null
        );
      }

      fee = {
        id: newData.id,
        contactBookId:
          newData.contactBookId || dataCheck.recordset[0].contactBookId,
        dateFee: newData.dateFee || dataCheck.recordset[0].dateFee,
        tuitionFee: newData.tuitionFee || dataCheck.recordset[0].tuitionFee,
        status: newData.status || dataCheck.recordset[0].status,
      };

      // Kiểm tra dữ liệu khóa ngoại có tồn tại
      var checkDataFK = await checkContactBook(fee.contactBookId);
      if (checkDataFK != null) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      dataCheck = await model.getAll({ contactBookId: fee.contactBookId });
      if (
        dataCheck.recordset.length != 0 &&
        dataCheck.recordset[0].id != newData.id
      ) {
        return result(
          Status.APIStatus.Invalid,
          null,
          "Đã tồn tại dữ liệu fee cho contact book",
          0,
          null
        );
      }

      // Update dữ liệu
      dataUpdate = await model.update(fee);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, fee, "Cập nhật thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, err, "Cập nhật dữ liệu thất bại", 0, null);
    }
  };

  this.getAllManager = async (id, contactBookId, studentId, offset, limit, result) => {
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

        if (contactBookId && !(contactBookId % 1 === 0)) {
          //Status, Data,	Message, Total, Headers
          return result(
            Status.APIStatus.Invalid,
            null,
            "Sai kiểu dữ liệu contacBook ",
            0,
            null
          );
        }

        // Lấy tất cả dữ liệu
        data = await model.getAll({
          contactBookId: contactBookId,
          studentId: studentId,
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

  this.getAllStudent = async (id, contactBookId, studentId, offset, limit, result) => {
    try {
      if (contactBookId && !(contactBookId % 1 === 0)) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Invalid,
          null,
          "Sai kiểu dữ liệu cho mã định danh của sổ liên lạc ",
          0,
          null
        );
      }
      // Lấy tất cả dữ liệu
      data = await model.getAll({
        contactBookId: contactBookId,
        studentId: studentId,
        offset: offset,
        limit: limit,
        feeId: id
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
      result(Status.APIStatus.Error, err, "Lấy dữ liệu thất bại", 0, null);
    }
  };

  this.getAllFamily = async (id, contactBookId, studentId, offset, limit, cmndFamily, result) => {
    try {
      if (contactBookId && !(contactBookId % 1 === 0)) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Invalid,
          null,
          "Sai kiểu dữ liệu cho mã định danh của sổ liên lạc ",
          0,
          null
        );
      }
      // Lấy tất cả dữ liệu
      data = await model.getAll({
        contactBookId: contactBookId,
        studentId: studentId,
        offset: offset,
        limit: limit,
        feeId: id,
        cmndFamily: cmndFamily
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
      result(Status.APIStatus.Error, err, "Lấy dữ liệu thất bại", 0, null);
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

  this.createAdmin = async (newData, userId, result) => {
    // Gán dữ liệu
    fee = {
      contactBookId: newData.contactBookId || null,
      dateFee: newData.dateFee || null,
      tuitionFee: newData.tuitionFee || null,
    };

    try {
      // Kiểm tra dữ liệu khóa ngoại có tồn tại
      var checkDataFK = await checkContactBook(fee.contactBookId);
      if (checkDataFK != null) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      dataCheck = await model.getAll({ contactBookId: fee.contactBookId });
      if (dataCheck.recordset.length != 0) {
        return result(Status.APIStatus.Invalid, null, "Đã tồn tại học phí", 0, null);
      }

      schoolIdContactBook = await (await modelSchool.getSchoolIdFromContactBook({ contactBook: newData.contactBookId })).recordset[0].schoolId;
      schoolIdTeacher = await (await modelSchool.getSchoolIdFromTeacher({ userId: userId })).recordset[0].schoolId;
      if (
        schoolIdContactBook !== schoolIdTeacher
      ) {
        return result(Status.APIStatus.Invalid, null, "Học sinh và lớp được chọn không cùng trường", 0, null);
      }

      // Thêm dữ liệu
      dataCreate = await model.create(fee);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, fee, "Tạo dữ liệu thành công", 1, null);
    } catch (err) {
      console.log(err);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Tạo dữ liệu thất bại", 0, null);
    }
  };

  this.createListAdmin = async (newData, userId, result) => {
    try {
      if (!newData.schoolYear || !newData.semester || !newData.gradeId) {
        //Status, Data,	Message, Total, Headers
        return result(Status.APIStatus.Ok, null, "Thiếu dữ liệu", 0, null);
      }

      if (!(newData.semester === "HK I" || newData.semester === "HK II")) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Invalid,
          null,
          "Sai thông tin học kỳ",
          0,
          null
        );
      }

      if (!(newData.schoolYear % 1 === 0)) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Invalid,
          null,
          "Sai thông tin year",
          0,
          null
        );
      }

      dataContactBook = await modelContactBook.getByYearSemesterGrade(
        newData.schoolYear,
        newData.semester,
        newData.gradeId
      );
      if (dataContactBook.recordset.length === 0) {
        //Status, Data,	Message, Total, Headers
        return result(Status.APIStatus.Ok, null, "Danh sách rỗng", 0, null);
      }

      schoolIdGrade = await (await modelSchool.getSchoolIdFromGrade({ gradeId: newData.gradeId })).recordset[0].schoolId;
      schoolIdTeacher = await (await modelSchool.getSchoolIdFromTeacher({ userId: userId })).recordset[0].schoolId;
      if (
        schoolIdGrade !== schoolIdTeacher
      ) {
        return result(Status.APIStatus.Invalid, null, "Không thuộc quyền quản lý", 0, null);
      }

      for (let index = 0; index < dataContactBook.recordset.length; index++) {
        fee = {
          contactBookId: dataContactBook.recordset[index].id || null,
          dateFee: newData.dateFee || null,
          tuitionFee: newData.tuitionFee || null,
        };

        dataCheck = await model.getAll({ contactBookId: fee.contactBookId });
        if (dataCheck.recordset.length != 0) {
          continue;
        }

        // Thêm dữ liệu
        dataCreate = await model.create(fee);
      }
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, fee, "Tạo dữ liệu thành công", 1, null);
    } catch (err) {
      console.log(err);
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
      var dataCheck = await model.getOne(newData.id);
      if (dataCheck.recordset.length === 0) {
        return result(
          Status.APIStatus.NotFound,
          null,
          "Không tồn tại dữ liệu",
          0,
          null
        );
      }

      fee = {
        id: newData.id,
        contactBookId:
          newData.contactBookId || dataCheck.recordset[0].contactBookId,
        dateFee: newData.dateFee || dataCheck.recordset[0].dateFee,
        tuitionFee: newData.tuitionFee || dataCheck.recordset[0].tuitionFee,
        status: newData.status || dataCheck.recordset[0].status,
      };

      // Kiểm tra dữ liệu khóa ngoại có tồn tại
      var checkDataFK = await checkContactBook(fee.contactBookId);
      if (checkDataFK != null) {
        return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
      }

      schoolIdFee = await (await modelSchool.getSchoolIdFromFee({ feeId: newData.id })).recordset[0].schoolId;
      schoolIdTeacher = await (await modelSchool.getSchoolIdFromTeacher({ userId: userId })).recordset[0].schoolId;
      if (
        schoolIdFee !== schoolIdTeacher
      ) {
        return result(Status.APIStatus.Invalid, null, "Không thuộc quyền quản lý", 0, null);
      }

      dataCheck = await model.getAll({ contactBookId: fee.contactBookId });
      if (
        dataCheck.recordset.length != 0 &&
        dataCheck.recordset[0].id != newData.id
      ) {
        return result(
          Status.APIStatus.Invalid,
          null,
          "Đã tồn tại dữ liệu fee cho contact book",
          0,
          null
        );
      }

      // Update dữ liệu
      dataUpdate = await model.update(fee);
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Ok, fee, "Cập nhật thành công", 1, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, null, "Cập nhật dữ liệu thất bại", 0, null);
    }
  };

  this.getAllAdmin = async (id, contactBookId, studentId, userId, offset, limit, result) => {
    try {
      if (contactBookId && !(contactBookId % 1 === 0)) {
        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.Invalid,
          null,
          "Sai kiểu dữ liệu sổ liên lạc ",
          0,
          null
        );
      }
      // Lấy tất cả dữ liệu
      data = await model.getAllAdmin({
        contactBookId: contactBookId,
        feeId: id,
        studentId: studentId,
        userId: userId,
        offset: offset,
        limit: limit
      });
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
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      result(Status.APIStatus.Error, err, "Lấy dữ liệu thất bại", 0, null);
    }
  };

  this.deleteAdmin = async (id, userId, result) => {
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
};
