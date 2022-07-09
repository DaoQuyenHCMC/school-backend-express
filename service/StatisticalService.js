var Statistical = require("../models/Statistical");
var Status = require("../common/core");

var model = new Statistical();
module.exports = function (){
this.getAllManager = async (userId, semester, yearId, result) => {
    try {
        // kiểm trả dữ liệu có tồn tại
        dataCheck = await model.getAllManager({ userId: userId, semester: semester, yearId: yearId });
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
        dataCheck.recordset[0].compareStudentCurrentWithLastYear = dataCheck.recordset[0].sumStudentManagerCurrentYear/
        dataCheck.recordset[0].sumStudentManagerLastYear || 0;

        dataCheck.recordset[0].sumFeeInYear = dataCheck.recordset[0].sumFeeInYear || 0;

        //Status, Data,	Message, Total, Headers
        result(Status.APIStatus.Ok, dataCheck.recordset[0], "Lấy dữ liệu thành công", 1, null);
    } catch (err) {
        //Status, Data,	Message, Total, Headers
        return result(Status.APIStatus.Error, null, "Lỗi", 0, null);
    }
};

this.getAllManagerMark = async (userId, semester, yearId, result) => {
    try {
        // kiểm trả dữ liệu có tồn tại
        dataCheck = await model.getAllManagerMark({ userId: userId, semester: semester, yearId: yearId });
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
       
        
        //Status, Data,	Message, Total, Headers
        result(Status.APIStatus.Ok, dataCheck.recordset, "Lấy dữ liệu thành công", 1, null);
    } catch (err) {
        //Status, Data,	Message, Total, Headers
        return result(Status.APIStatus.Error, null, "Lỗi", 0, null);
    }
};


this.getAllAdmin = async (userId, semester, yearId, result) => {
    try {
        // kiểm trả dữ liệu có tồn tại
        dataCheck = await model.getAllAdmin({ userId: userId, semester: semester, yearId: yearId });
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
        dataCheck.recordset[0].compareStudentCurrentWithLastYear = dataCheck.recordset[0].sumStudentAdminCurrentYear/
        dataCheck.recordset[0].sumStudentAdminLastYear || 0;
        //Status, Data,	Message, Total, Headers
        result(Status.APIStatus.Ok, dataCheck.recordset[0], "Lấy dữ liệu thành công", 1, null);
    } catch (err) {
        //Status, Data,	Message, Total, Headers
        return result(Status.APIStatus.Error, null, "Lỗi", 0, null);
    }
};

this.getAllAdminMark = async (userId, semester, yearId, result) => {
    try {
        // kiểm trả dữ liệu có tồn tại
        dataCheck = await model.getAllAdminMark({ userId: userId, semester: semester, yearId: yearId });
        if (dataCheck.recordset.length === 0) {
            //Status, Data,	Message, Total, Headers
            return result(
                Status.APIStatus.NotFound,
                null,
                "Không tìm thấy dữ liệu tương ứng",
                0,
                null
            );
        }
        
        //Status, Data,	Message, Total, Headers
        result(Status.APIStatus.Ok, dataCheck.recordset, "Lấy dữ liệu thành công", 1, null);
    } catch (err) {
        //Status, Data,	Message, Total, Headers
        return result(Status.APIStatus.Error, null, "Lỗi", 0, null);
    }
};
}