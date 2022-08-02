var Status = require("../common/core");
var ClassSC = require("../models/Class");
var Cources = require("../models/Cources");
var School = require("../models/School");
var Subject = require("../models/Subject");
var Year = require("../models/Year");

var modelSubject = new Subject();
var modelYear = new Year();
var modelClassSC = new ClassSC();
var modelSchool = new School();
var model = new Cources();

module.exports = function () {
    // Kiểm tra dữ liệu khóa chính
    const checkId = async (id) => {
        try {
            data = await model.getAllManager({ courceId: id })
            if (data.recordset.length !== 0) {
                return data.recordset[0];
            }
        } catch (err) {
            console.log(err);
        }
        return null;
    };

    const checkSchoolClassTeacherSubjectYear = async (schoolId, classId, teacherId, subjectId, yearId) => {
        try {
            dataSchool = await modelSchool.getAllManager({ schoolId: schoolId });
            if (dataSchool.recordset.length === 0) {
                return "Không tìm thấy trường";
            }
            dataSubject = await modelSubject.getOne(subjectId);
            if (dataSubject.recordset.length === 0) {
                return "Không tìm thấy môn học";
            }
            if (classId || teacherId) {
                dataClass = await modelClassSC.checkClassOfSchoolTeacher({ classId: classId, schoolId: schoolId, teacherId: teacherId });
                if (dataClass.recordset.length === 0) {
                    return "Thông tin cho lớp học, giáo viên và trường không đúng hoặc không cùng trường";
                }
            }
            if (yearId) {
                dataYear = await modelYear.getOne(yearId);
                if (dataYear.recordset.length === 0) {
                    return "Không tìm thấy thông tin năm học";
                }
            }
        } catch (err) {
            console.log(err);
        }
        return null;
    };


    this.createManager = async (newData, result) => {
        cource = {
            teacherId: newData.teacherId || null, // xét
            classId: newData.classId || null, // xet
            schoolId: newData.schoolId || null, // xét
            name: newData.name || null,
            subjectId: newData.subjectId || null, // xét
            yearId: newData.yearId || null,
            semester: newData.semester || 'HK I',
        };

        try {
            var checkDataFK = await checkSchoolClassTeacherSubjectYear(
                cource.schoolId,
                cource.classId,
                cource.teacherId,
                cource.subjectId,
                cource.yearId
            );
            if (checkDataFK) {
                return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
            }

            if(!cource.name && cource.classId){
                // Lấy tên lớp
                dataClass = await modelClassSC.getNameClassByClassId(
                    cource.classId
                );
                // Lấy tên lớp
                dataSubject = await modelSubject.getNameById(
                    cource.subjectId
                );
                if (dataClass.recordset.length == 0 || dataSubject.recordset.length == 0) {
                    return result(Status.APIStatus.NotFound, null, null, 0, null);
                }
                cource.name = dataSubject.recordset[0].name + " lớp " + dataClass.recordset[0].name.split("/")[0];
            }
            var checkDataDuplicate = await model.checkDuplicateData({
                schoolId: cource.schoolId,
                classId: cource.classId,
                subjectId: cource.subjectId,
                yearId: cource.yearId,
                semester: cource.semester
            });
            if (checkDataDuplicate.recordset.length !== 0) {
                return result(Status.APIStatus.Invalid, null, "Dữ liệu đã tồn tại", 0, null);
            }
            // Thêm dữ liệu
            await model.create(cource);
            //Status, Data,	Message, Total, Headers
            result(Status.APIStatus.Ok, null, "Tạo thành công", 1, null);
        } catch (err) {
            //Status, Data,	Message, Total, Headers
            result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
        }
    };

    this.updateManager = async (newData, result) => {
        try {
            // kiểm trả dữ liệu có tồn tại
            var dataCheck = await checkId(newData.id);
            if (dataCheck == null) {
                return result(
                    Status.APIStatus.Invalid,
                    null,
                    "Không tồn tại dữ liệu",
                    0,
                    null
                );
            }
            cource = {
                id: dataCheck.idCources,
                teacherId: newData.teacherId || dataCheck.teacherId, // xét
                classId: newData.classId || dataCheck.classId, // xet
                schoolId: newData.schoolId || dataCheck.schoolId, // xét
                name: newData.name || dataCheck.name,
                subjectId: newData.subjectId || dataCheck.subjectId, // xét
                yearId: newData.yearId || dataCheck.yearId,
                semester: newData.semester || dataCheck.semester,
            };
            
            var checkDataFK = await checkSchoolClassTeacherSubjectYear(
                cource.schoolId,
                cource.classId,
                cource.teacherId,
                cource.subjectId,
                cource.yearId
            );
            if (!checkDataFK) {
                return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
            }
            if(!cource.name && cource.classId){
                // Lấy tên lớp
                dataClass = await modelClassSC.getNameClassByClassId(
                    cource.classId
                );
                // Lấy tên lớp
                dataSubject = await modelSubject.getNameById(
                    cource.subjectId
                );
                if (dataClass.recordset.length == 0 || dataSubject.recordset.length == 0) {
                    return result(Status.APIStatus.NotFound, null, null, 0, null);
                }
                cource.name = dataSubject.recordset[0].name + " lớp " + dataClass.recordset[0].name.split("/")[0];
            }
            var checkDataDuplicate = await model.checkDuplicateData({
                schoolId: cource.schoolId,
                classId: cource.classId,
                subjectId: cource.subjectId,
                yearId: cource.yearId,
                semester: cource.semester,
                courceId: cource.id
            });
            if (checkDataDuplicate.recordset.length !== 0) {
                return result(Status.APIStatus.Invalid, null, "Dữ liệu đã tồn tại", 0, null);
            }
            // Thêm dữ liệu
            await model.update(cource);
            //Status, Data,	Message, Total, Headers
            result(Status.APIStatus.Ok, classSchool, "Tạo thành công", 1, null);
        } catch (err) {
            //Status, Data,	Message, Total, Headers
            result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
        }
    };

    this.getAllManager = async (id, gradeId, teacherId, schoolId, classId, studentId, semester, yearId, offset, limit, courseNameFind, courseIdFind, result) => {
        try {
            // Lấy tất cả dữ liệu
            data = await model.getAllManager({
                gradeId: gradeId,
                teacherId: teacherId,
                schoolId: schoolId,
                classId: classId,
                courceId: id,
                studentId: studentId,
                semester: semester,
                yearId: yearId,
                offset: offset,
                limit: limit,
                courseNameFind: courseNameFind,
                courseIdFind: courseIdFind
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

    this.getCourceNameManager = async (id, gradeId, teacherId, schoolId, classId, studentId, semester, yearId, offset, limit, result) => {
        try {
            // Lấy tất cả dữ liệu
            data = await model.getCourceNameManager({
                gradeId: gradeId,
                teacherId: teacherId,
                schoolId: schoolId,
                classId: classId,
                courceId: id,
                studentId: studentId,
                semester: semester,
                yearId: yearId,
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
            dataCheck = await model.getAllManager({ courceId: id });
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
            result(Status.APIStatus.Ok, null, "Xóa thành công", 1, null);
        } catch (err) {
            //Status, Data,	Message, Total, Headers
            return result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
        }
    };


    this.createAdmin = async (newData, userId, result) => {
        cource = {
            teacherId: newData.teacherId || null, // xét
            classId: newData.classId || null, // xét
            name: newData.name || null,
            subjectId: newData.subjectId || null, // xét
            yearId: newData.yearId || null,
            semester: newData.semester || 'HK I',
        };

        cource.schoolId = await (await modelSchool.getSchoolIdFromTeacher({ userId: userId })).recordset[0].schoolId;

        try {
            var checkDataFK = await checkSchoolClassTeacherSubjectYear(
                cource.schoolId,
                cource.classId,
                cource.teacherId,
                cource.subjectId,
                cource.yearId
            );
            if (checkDataFK != null) {
                return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
            }
            if(!cource.name && cource.classId){
                // Lấy tên lớp
                dataClass = await modelClassSC.getNameClassByClassId(
                    cource.classId
                );
                // Lấy tên lớp
                dataSubject = await modelSubject.getNameById(
                    cource.subjectId
                );
                if (dataClass.recordset.length == 0 || dataSubject.recordset.length == 0) {
                    return result(Status.APIStatus.NotFound, null, null, 0, null);
                }
                cource.name = dataSubject.recordset[0].name + " lớp " + dataClass.recordset[0].name.split("/")[0];
            }
            var checkDataDuplicate = await model.checkDuplicateData({
                schoolId: cource.schoolId,
                classId: cource.classId,
                subjectId: cource.subjectId,
                yearId: cource.yearId,
                semester: cource.semester
            });
            if (checkDataDuplicate.recordset.length !== 0) {
                return result(Status.APIStatus.Invalid, null, "Dữ liệu đã tồn tại", 0, null);
            }
            // Thêm dữ liệu
            await model.create(cource);
            //Status, Data,	Message, Total, Headers
            result(Status.APIStatus.Ok, null, "Tạo thành công", 1, null);
        } catch (err) {
            //Status, Data,	Message, Total, Headers
            result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
        }
    };

    this.updateManager = async (newData, result) => {
        try {
            // kiểm trả dữ liệu có tồn tại
            var dataCheck = await checkId(newData.id);
            if (dataCheck == null) {
                return result(
                    Status.APIStatus.Invalid,
                    null,
                    "Không tồn tại dữ liệu",
                    0,
                    null
                );
            }
            cource = {
                id: dataCheck.idCources,
                teacherId: newData.teacherId || dataCheck.teacherId, // xét
                classId: newData.classId || dataCheck.classId, // xet
                schoolId: newData.schoolId || dataCheck.schoolId, // xét
                name: newData.name || dataCheck.nameCources,
                subjectId: newData.subjectId || dataCheck.subjectId, // xét
                yearId: newData.yearId || dataCheck.schoolYear,
                semester: newData.semester || dataCheck.semester,
            };

            var checkDataFK = await checkSchoolClassTeacherSubjectYear(
                cource.schoolId,
                cource.classId,
                cource.teacherId,
                cource.subjectId,
                cource.yearId
            );
            if (checkDataFK != null) {
                return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
            }
            var checkDataDuplicate = await model.checkDuplicateData({
                schoolId: cource.schoolId,
                classId: cource.classId,
                subjectId: cource.subjectId,
                yearId: cource.yearId,
                semester: cource.semester,
                courceId: cource.id
            });
            if (checkDataDuplicate.recordset.length !== 0) {
                return result(Status.APIStatus.Invalid, null, "Dữ liệu đã tồn tại", 0, null);
            }
            // Thêm dữ liệu
            await model.update(cource);
            //Status, Data,	Message, Total, Headers
            result(Status.APIStatus.Ok, null, "Cập nhật thành công", 1, null);
        } catch (err) {
            //Status, Data,	Message, Total, Headers
            result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
        }
    };

    this.updateAdmin = async (newData, userId, result) => {
        try {
            // kiểm trả dữ liệu có tồn tại
            var dataCheck = await checkId(newData.id);
            if (dataCheck == null) {
                return result(
                    Status.APIStatus.Invalid,
                    null,
                    "Không tồn tại dữ liệu",
                    0,
                    null
                );
            }
            cource = {
                id: dataCheck.idCources,
                teacherId: newData.teacherId || dataCheck.teacherId, // xét
                classId: newData.classId || dataCheck.classId, // xet
                schoolId: dataCheck.schoolId, // xét
                name: newData.name || dataCheck.nameCources,
                subjectId: newData.subjectId || dataCheck.subjectId, // xét
                yearId: newData.yearId || dataCheck.schoolYear,
            };
            cource.schoolId = await (await modelSchool.getSchoolIdFromTeacher({ userId: userId })).recordset[0].schoolId;
            var checkDataFK = await checkSchoolClassTeacherSubjectYear(
                cource.schoolId,
                cource.classId,
                cource.teacherId,
                cource.subjectId,
                cource.yearId
            );
            if (checkDataFK != null) {
                return result(Status.APIStatus.Invalid, null, checkDataFK, 0, null);
            }
            // Thêm dữ liệu
            await model.update(cource);
            //Status, Data,	Message, Total, Headers
            result(Status.APIStatus.Ok, null, "Cập nhật  thành công", 1, null);
        } catch (err) {
            //Status, Data,	Message, Total, Headers
            result(Status.APIStatus.Error, null, "Sai kiểu dữ liệu", 0, null);
        }
    };

    this.getAllAdmin = async (id, gradeId, teacherId, userId, classId, studentId, semester, yearId, offset, limit, courseNameFind, courseIdFind, result) => {
        try {
            // Lấy tất cả dữ liệu
            data = await model.getAllAdmin({
                // gradeId: gradeId,
                teacherId: teacherId,
                classId: classId,
                courceId: id,
                studentId: studentId,
                semester: semester,
                yearId: yearId,
                userId: userId,
                offset: offset,
                limit: limit,
                courseNameFind: courseNameFind,
                courseIdFind: courseIdFind
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

    this.getCourceNameAdmin = async (id, gradeId, teacherId, userId, classId, studentId, semester, yearId, result) => {
        try {
            // Lấy tất cả dữ liệu
            data = await model.getCourceNameAdmin({
                // gradeId: gradeId,
                teacherId: teacherId,
                classId: classId,
                courceId: id,
                studentId: studentId,
                semester: semester,
                yearId: yearId,
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

    this.getAllTeacher = async (id, gradeId, userId, classId, offset, limit, courseNameFind, courseIdFind, result) => {
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
                classId: classId,
                teacherId: userId,
                courceId: id,
                offset: offset,
                limit: limit,
                courseNameFind: courseNameFind,
                courseIdFind: courseIdFind
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

    this.getAllTeacherNameCourse = async (userId, result) => {
        try {
            // Lấy tất cả dữ liệu
            data = await model.getAllTeacherNameCourse({
                teacherId: userId
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

};
