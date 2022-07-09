//connect DB
const { conn, sql } = require("../config/db");

module.exports = function () {

  const baseUrlPagination = "OFFSET (@offset-1)*@limit ROWS FETCH NEXT @limit ROWS ONLY ";
  this.getAll = async function ({
    classId,
    teacherId,
    schoolId,
    gradeId,
    familyCMND,
    offset,
    limit
  }) {
    const pool = await conn;
    var sqlString =
      "SELECT s.id, s.email, s.[name], s.phone, s.[address], s.[status], s.role_id roleId, r.[name] roleName, s.class_id classId, c.[name] className, s.cmnd_family cmndFamily, t.id teacherId, t.[name] teacherName, sc.[name] schoolName, t.school_id schoolId, g.id gradeId, g.[name] gradeName, f.cmnd CMNDFamily, f.name nameFamily FROM dbo.student s " +
      "LEFT JOIN dbo.class c ON s.class_id = c.id " +
      "LEFT  JOIN dbo.teacher t ON c.teacher_id = t.id " +
      "LEFT JOIN dbo.school sc ON t.school_id = sc.id " +
      "LEFT JOIN dbo.family f ON s.cmnd_family = f.cmnd " +
      "LEFT JOIN dbo.[role] r ON s.role_id = r.id " +
      "LEFT JOIN dbo.grade g ON g.id = c.grade_id ";

    if (classId || teacherId || schoolId || gradeId || familyCMND) {
      sqlString += "WHERE ";
      if (classId) {
        sqlString += "s.class_id = '" + classId + "' ";
      }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        teacherId
      ) {
        sqlString += "AND ";
      }

      if (teacherId) {
        sqlString += "c.teacher_id = '" + teacherId + "' ";
      }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        schoolId
      ) {
        sqlString += "AND ";
      }

      if (schoolId) {
        sqlString += "t.school_id = '" + schoolId + "' ";
      }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        gradeId
      ) {
        sqlString += "AND ";
      }

      if (gradeId) {
        sqlString += "c.grade_id = '" + gradeId + "' ";
      }
      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        familyCMND
      ) {
        sqlString += "AND ";
      }

      if (familyCMND) {
        sqlString += "f.cmnd = '" + familyCMND + "' ";
      }
    }
    sqlString += " ORDER BY sc.[name], g.[name], c.[name], s.id ";
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getAllManager = async function ({
    studentId,
    classId,
    teacherId,
    schoolId,
    gradeId,
    studentIdFind,
    offset,
    limit,
    studentNameFind
  }) {
    const pool = await conn;
    var sqlString =
      "SELECT s.id, s.email, s.[name], s.phone, s.[address], s.[status], s.role_id roleId, r.[name] roleName, s.class_id classId, c.[name] className, s.cmnd_family cmndFamily, t.id teacherId, t.[name] teacherName, sc.[name] schoolName, t.school_id schoolId, g.id gradeId, g.[name] gradeName, f.cmnd CMNDFamily, f.name nameFamily FROM dbo.student s " +
      "LEFT JOIN dbo.class c ON s.class_id = c.id " +
      "LEFT  JOIN dbo.teacher t ON c.teacher_id = t.id " +
      "LEFT JOIN dbo.school sc ON t.school_id = sc.id " +
      "LEFT JOIN dbo.family f ON s.cmnd_family = f.cmnd " +
      "LEFT JOIN dbo.[role] r ON s.role_id = r.id " +
      "LEFT JOIN dbo.grade g ON g.id = c.grade_id ";

    if (classId || teacherId || schoolId || gradeId || studentId || studentIdFind || studentNameFind) {
      sqlString += "WHERE ";
      if (classId) {
        sqlString += "s.class_id = @classId ";
      }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        teacherId
      ) {
        sqlString += "AND ";
      }

      if (teacherId) {
        sqlString += "c.teacher_id = @teacherId ";
      }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        schoolId
      ) {
        sqlString += "AND ";
      }

      if (schoolId) {
        sqlString += "t.school_id = @schoolId ";
      }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        gradeId
      ) {
        sqlString += "AND ";
      }

      if (gradeId) {
        sqlString += "c.grade_id = @gradeId ";
      }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        studentIdFind
      ) {
        sqlString += "AND ";
      }

      if (studentIdFind) {
        sqlString += "s.id like '%" + studentIdFind + "%' ";
      }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        studentNameFind
      ) {
        sqlString += "AND ";
      }

      if (studentNameFind) {
        sqlString += "s.name like N'%" + studentNameFind + "%' ";
      }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        studentId
      ) {
        sqlString += "AND ";
      }

      if (studentId) {
        sqlString += "s.id = '" + studentId + "' ";
      }
    }
    sqlString += " ORDER BY sc.[name], g.[name], c.[name], s.id ";
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("classId", sql.Int, classId)
      .input("gradeId", sql.Int, gradeId)
      .input("schoolId", sql.VarChar, schoolId)
      .input("teacherId", sql.VarChar, teacherId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getAllAdmin = async function ({
    studentId,
    classId,
    teacherId,
    gradeId,
    userId,
    studentIdFind,
    offset,
    limit,
    studentNameFind
  }) {
    const pool = await conn;
    var sqlString =
      "SELECT s.id, s.email, s.[name], s.phone, s.[address], s.[status], s.role_id roleId, r.[name] roleName, s.class_id classId, c.[name] className, s.cmnd_family cmndFamily, t.id teacherId, t.[name] teacherName, sc.[name] schoolName, t.school_id schoolId, g.id gradeId, g.[name] gradeName, f.cmnd CMNDFamily, f.name nameFamily FROM dbo.student s " +
      "LEFT JOIN dbo.class c ON s.class_id = c.id " +
      "LEFT  JOIN dbo.teacher t ON c.teacher_id = t.id " +
      "LEFT JOIN dbo.school sc ON t.school_id = sc.id " +
      "LEFT JOIN dbo.family f ON s.cmnd_family = f.cmnd " +
      "LEFT JOIN dbo.[role] r ON s.role_id = r.id " +
      "LEFT JOIN dbo.grade g ON g.id = c.grade_id " +
      "WHERE s.school_id = dbo.GetIdSchoolFromIdTeacher(@userId) ";

      if (classId) sqlString += "AND s.class_id = @classId "; 
      if (teacherId) sqlString += "AND c.teacher_id = @teacherId "; 
      if (gradeId) sqlString += "AND c.grade_id = @gradeId "; 
      if (studentId) sqlString += "AND s.id = @studentId "; 
      if (studentIdFind) sqlString += "AND s.id like '%" + studentIdFind + "%' ";
      if (studentNameFind) sqlString += "AND s.name like N'%" + studentNameFind + "%' ";
    sqlString += " ORDER BY g.[name], c.[name], s.id ";
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("classId", sql.Int, classId)
      .input("gradeId", sql.Int, gradeId)
      .input("userId", sql.VarChar, userId)
      .input("teacherId", sql.VarChar, teacherId)
      .input("studentId", sql.VarChar, studentId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getIdClassNameTeacherId = async function ({ classId }) {
    const pool = await conn;
    var sqlString =
      "SELECT s.id studentId, c.[name] className, t.id teacherId, c.id classId FROM dbo.Student s " +
      "LEFT JOIN dbo.Class c ON s.class_id = c.id " +
      "LEFT JOIN dbo.Teacher t ON c.teacher_id = t.id WHERE class_id = @classId";
    return await pool
      .request()
      .input("classId", sql.Int, classId)
      .query(sqlString);
  };

  this.getOne = async function (id) {
    const pool = await conn;
    var sqlString =
      "SELECT s.id, s.email, s.[name], s.phone, s.[address], s.[status], s.role_id roleId, r.[name] roleName, s.class_id classId, c.[name] className, s.cmnd_family cmndFamily, t.id teacherId, t.[name] teacherName, sc.[name] schoolName, t.school_id schoolId, f.cmnd CMNDFamily, f.name nameFamily FROM dbo.student s " +
      "LEFT JOIN dbo.class c ON s.class_id = c.id " +
      "LEFT JOIN dbo.teacher t ON c.teacher_id = t.id " +
      "LEFT JOIN dbo.school sc ON t.school_id = sc.id " +
      "LEFT JOIN dbo.family f ON s.cmnd_family = f.cmnd " +
      "LEFT JOIN dbo.[role] r ON s.role_id = r.id WHERE s.id = @id";
    return await pool.request().input("id", sql.VarChar, id).query(sqlString);
  };

  this.checkEmail = async function (email) {
    const pool = await conn;
    var sqlString = "SELECT 1 FROM Student WHERE email = @email";
    return await pool
      .request()
      .input("email", sql.VarChar, email)
      .query(sqlString);
  };

  this.create = async function (newData) {
    const pool = await conn;
    var sqlString =
      "INSERT INTO dbo.Student(id, school_id, role_id, class_id, address, email, name, password, cmnd_family, phone, status, create_day, update_day, last_modify_by, create_by) " +
      "VALUES (@id, @schoolId, @roleId, @classId,  N'" +
      newData.address +
      "', @email, N'" +
      newData.name +
      "', @password, @cmndFamily, @phone, @status, @createDay, @updateDay, @updateBy, @createBy)";
    return await pool
      .request()
      .input("id", sql.VarChar, newData.id)
      .input("roleId", sql.VarChar, "STUDENT")
      .input("schoolId", sql.VarChar, newData.schoolId)
      .input("classId", sql.Int, newData.classId)
      .input("email", sql.VarChar, newData.email)
      .input("password", sql.VarChar, newData.password)
      .input("cmndFamily", sql.VarChar, newData.cmndFamily)
      .input("phone", sql.VarChar, newData.phone)
      .input("status", sql.Bit, newData.status)
      .input("createDay", sql.Date, Date.now())
      .input("updateDay", sql.Date, Date.now())
      .input("createBy", sql.VarChar, newData.createBy)
      .input("updateBy", sql.VarChar, newData.updateBy)
      .query(sqlString);
  };

  this.update = async function (newData) {
    const pool = await conn;
    var sqlString =
      "UPDATE dbo.Student SET  class_id = @classId, address = N'" +
      newData.address +
      "', email = @email, name = N'" +
      newData.name +
      "', password = @password, phone = @phone, cmnd_family = @cmndFamily,  " +
      "status = @status, update_day= @updateDay, last_modify_by = @updateBy, school_id = @schoolId" +
      " WHERE id= @id";
    return await pool
      .request()
      .input("id", sql.VarChar, newData.id)
      .input("classId", sql.Int, newData.classId)
      .input("schoolId", sql.VarChar, newData.schoolId)
      .input("email", sql.VarChar, newData.email)
      .input("password", sql.VarChar, newData.password)
      .input("cmndFamily", sql.VarChar, newData.cmndFamily)
      .input("phone", sql.VarChar, newData.phone)
      .input("status", sql.VarChar, newData.status)
      .input("updateDay", sql.Date, Date.now())
      .input("updateBy", sql.VarChar, newData.updateBy)
      .query(sqlString);
  };

  this.delete = async function (id) {
    const pool = await conn;
    var sqlString = "DELETE FROM Student WHERE id = @id";
    return await pool.request().input("id", sql.VarChar, id).query(sqlString);
  };

  this.transferClass = async function (oldClass, newClass) {
    const pool = await conn;
    var sqlString = "UPDATE dbo.Student SET class_id = @newClass WHERE class_id = @oldClass";
    return await pool.request()
      .input("oldClass", sql.Int, oldClass)
      .input("newClass", sql.Int, newClass)
      .query(sqlString);
  };

  this.getAllTeacher = async function ({
    studentId,
    classId,
    gradeId,
    userId,
    studentIdFind,
    offset,
    limit,
    studentNameFind
  }) {
    const pool = await conn;
    var sqlString =
      "SELECT s.id, s.email, s.[name], s.phone, s.[address], s.[status], s.role_id roleId, r.[name] roleName, s.class_id classId, c.[name] className, s.cmnd_family cmndFamily, t.id teacherId, t.[name] teacherName, sc.[name] schoolName, t.school_id schoolId, g.id gradeId, g.[name] gradeName, f.cmnd CMNDFamily, f.name nameFamily FROM dbo.student s " +
      "LEFT JOIN dbo.class c ON s.class_id = c.id " +
      "LEFT  JOIN dbo.teacher t ON c.teacher_id = t.id " +
      "LEFT JOIN dbo.school sc ON t.school_id = sc.id " +
      "LEFT JOIN dbo.family f ON s.cmnd_family = f.cmnd " +
      "LEFT JOIN dbo.[role] r ON s.role_id = r.id " +
      "LEFT JOIN dbo.grade g ON g.id = c.grade_id " +
      "WHERE s.school_id = dbo.GetIdSchoolFromIdTeacher(@userId) AND c.teacher_id = @userId ";
      if (classId) sqlString += "AND s.class_id = @classId ";
      if (gradeId) sqlString += "AND c.grade_id = @gradeId ";
      if (studentId) sqlString += "AND s.id = @studentId ";
      if (studentIdFind) sqlString += "AND s.id like '%" + studentIdFind + "%' ";
      if (studentNameFind) sqlString += "AND s.name like N'%" + studentNameFind + "%' ";
    sqlString += " ORDER BY g.[name], c.[name], s.id ";
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("classId", sql.Int, classId)
      .input("gradeId", sql.Int, gradeId)
      .input("userId", sql.VarChar, userId)
      .input("studentId", sql.VarChar, studentId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getAllTeacherCourse = async function ({
    userId,
    studentId
  }) {
    const pool = await conn;
    var sqlString =
      "select s.id from dbo.student s " +
      "inner join dbo.cources cour on cour.class_id = s.class_id " +
      "where cour.teacher_id = @userId ";
    if(studentId) sqlString += "and s.id = @studentId "
    return await pool.request()
      .input("userId", sql.VarChar, userId)
      .input("studentId", sql.VarChar, studentId)
      .query(sqlString);
  };

  this.getAllTeacherHomeroom = async function ({
    userId,
    studentId
  }) {
    const pool = await conn;
    var sqlString =
      "select s.id from dbo.student s " +
      "inner join dbo.class c on c.id= s.class_id " +
      "where c.teacher_id = @userId ";
    if (studentId) sqlString += "and s.id = @studentId "
    sqlString += " group by s.id "
    return await pool.request()
      .input("userId", sql.VarChar, userId)
      .input("studentId", sql.VarChar, studentId)
      .query(sqlString);
  };

  this.getFamilyByStudent = async function ({
    studentId
  }) {
    const pool = await conn;
    var sqlString =
      "SELECT f.cmnd CMND FROM dbo.student s " +
      "LEFT JOIN dbo.family f ON s.cmnd_family = f.cmnd " +
      "WHERE s.id = @studentId ";
    return await pool.request()
      .input("studentId", sql.VarChar, studentId)
      .query(sqlString);
  };

};
