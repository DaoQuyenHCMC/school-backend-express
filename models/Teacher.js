//connect DB
const { conn, sql } = require("../config/db");

module.exports = function () {

  const baseUrlPagination = "OFFSET (@offset-1)*@limit ROWS FETCH NEXT @limit ROWS ONLY ";
  this.getAll = async function ({ schoolId, offset, limit }) {
    const pool = await conn;
    var sqlString =
      "SELECT t.id, t.[address], t.cmnd, t.[name], t.[email], t.phone, t.salary, t.[status], r.[name] roleName, t.roleId, s.[name] schoolName, t.schoolId FROM dbo.Teacher t " +
      "INNER JOIN dbo.[Role] r ON t.roleId = r.id " +
      "INNER JOIN dbo.School s ON t.schoolId = s.id ";
    if (schoolId !== "") {
      sqlString += "WHERE t.schoolId = '" + schoolId + "' ";
    }

    sqlString += " ORDER BY s.[name], t.id ";
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getAllManager = async function ({ schoolId, teacherId, teacherIdFind, offset, limit, teacherNameFind }) {
    const pool = await conn;
    var sqlString =
      "SELECT t.id, t.[address], t.cmnd, t.[name], t.[email], t.phone, t.salary, t.[status], r.[name] roleName, t.role_id roleId, s.[name] schoolName, t.school_id schoolId FROM dbo.teacher t " +
      "INNER JOIN dbo.[role] r ON t.role_id = r.id " +
      "INNER JOIN dbo.school s ON t.school_id = s.id ";
    if (schoolId || teacherId || teacherIdFind || teacherNameFind) {
      sqlString += "WHERE ";
      if (teacherId) {
        sqlString += "t.id = @teacherId ";
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
        teacherIdFind
      ) {
        sqlString += "AND ";
      }

      if (teacherIdFind) {
        sqlString += "t.id like '%" + teacherIdFind + "%' ";
      }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        teacherNameFind
      ) {
        sqlString += "AND ";
      }

      if (teacherNameFind) {
        sqlString += "t.name like N'%" + teacherNameFind + "%' ";
      }
    }

    sqlString += " ORDER BY s.[name], t.id ";
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("teacherId", sql.VarChar, teacherId)
      .input("schoolId", sql.VarChar, schoolId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getOne = async function (id) {
    const pool = await conn;
    var sqlString = "SELECT t.id, t.[address], t.cmnd, t.[name], t.[email], t.phone, t.salary, t.[status], r.[name] roleName, t.role_id roleId, s.[name] schoolName, t.school_id schoolId FROM dbo.teacher t " +
      "INNER JOIN dbo.[role] r ON t.role_id = r.id " +
      "LEFT JOIN dbo.school s ON t.school_id = s.id WHERE t.id = @id";
    return await pool.request().input("id", sql.VarChar, id).query(sqlString);
  };

  this.getIdNameTeacherByClassId = async function (id) {
    const pool = await conn;
    var sqlString = "SELECT t.id, t.[name] FROM dbo.teacher t " +
      "INNER JOIN dbo.Class c ON c.teacher_id = t.id " +
      "WHERE c.id =  @id";
    return await pool.request().input("id", sql.VarChar, id).query(sqlString);
  };

  this.checkEmail = async function (email) {
    const pool = await conn;
    var sqlString = "SELECT 1 FROM dbo.teacher WHERE email = @email";
    return await pool
      .request()
      .input("email", sql.VarChar, email)
      .query(sqlString);
  };

  this.checkCMND = async function (cmnd) {
    const pool = await conn;
    var sqlString = "SELECT 1 FROM dbo.teacher WHERE cmnd = @cmnd";
    return await pool
      .request()
      .input("cmnd", sql.VarChar, cmnd)
      .query(sqlString);
  };

  this.create = async function (newData) {
    const pool = await conn;
    var sqlString =
      "INSERT INTO dbo.Teacher(id, name, address, cmnd, email, password, phone, role_id, salary, school_id, status, create_by, create_day, update_day, update_by) " +
      "VALUES (@id, N'" +
      newData.name +
      "', N'" +
      newData.address +
      "', @cmnd, @email, @password, @phone, @roleId, @salary, @schoolId, @status, @create_by, @create_day, @update_day, @update_by)";
    return await pool
      .request()
      .input("id", sql.VarChar, newData.id)
      .input("cmnd", sql.VarChar, newData.cmnd)
      .input("email", sql.VarChar, newData.email)
      .input("password", sql.VarChar, newData.password)
      .input("phone", sql.VarChar, newData.phone)
      .input("roleId", sql.VarChar, newData.roleId)
      .input("salary", sql.Money, newData.salary)
      .input("schoolId", sql.VarChar, newData.schoolId)
      .input("status", sql.VarChar, 'True')
      .input("create_by", sql.VarChar, newData.createBy)
      .input("update_by", sql.VarChar, newData.updateBy)
      .input("create_day", sql.Date, Date.now())
      .input("update_day", sql.Date, Date.now())
      .query(sqlString);
  };

  this.update = async function (newData) {
    const pool = await conn;
    var sqlString =
      "UPDATE dbo.Teacher SET name =  N'" +
      newData.name +
      "', address = N'" +
      newData.address +
      "', cmnd = @cmnd, email = @email, password = @password, " +
      "phone = @phone, role_id = @roleId, salary = @salary, school_id = @schoolId, status = @status, update_day = @update_day, update_by = @update_by" +
      " WHERE id= @id";
    console.log(sqlString);
    return await pool
      .request()
      .input("id", sql.VarChar, newData.id)
      .input("cmnd", sql.VarChar, newData.cmnd)
      .input("email", sql.VarChar, newData.email)
      .input("password", sql.VarChar, newData.password)
      .input("phone", sql.VarChar, newData.phone)
      .input("roleId", sql.VarChar, newData.roleId)
      .input("salary", sql.Money, newData.salary)
      .input("schoolId", sql.VarChar, newData.schoolId)
      .input("status", sql.VarChar, newData.status)
      .input("update_by", sql.VarChar, newData.update_by)
      .input("update_day", sql.Date, Date.now())
      .query(sqlString);
  };

  this.delete = async function (id) {
    const pool = await conn;
    var sqlString = "DELETE FROM teacher WHERE id = @id";
    return await pool.request().input("id", sql.VarChar, id).query(sqlString);
  };

  this.getAllAdmin = async function ({ userId, teacherId, teacherIdFind, offset, limit, teacherNameFind }) {
    const pool = await conn;
    var sqlString =
      "SELECT t.id, t.[address], t.cmnd, t.[name], t.[email], t.phone, t.salary, t.[status], r.[name] roleName, t.role_id roleId, s.[name] schoolName, t.school_id schoolId FROM dbo.teacher t " +
      "INNER JOIN dbo.[role] r ON t.role_id = r.id " +
      "INNER JOIN dbo.school s ON t.school_id = s.id " +
      "WHERE t.school_id = dbo.GetIdSchoolFromIdTeacher(@userId) ";
    if (teacherId) sqlString += "AND t.id = @teacherId";
    if (teacherIdFind) sqlString += "AND t.id like '%" + teacherIdFind + "%' ";
    if (teacherNameFind) sqlString += "AND t.name like N'%" + teacherNameFind + "%' ";
    sqlString += " ORDER BY t.id ";
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("userId", sql.VarChar, userId)
      .input("teacherId", sql.VarChar, teacherId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getAllTeacher = async function ({ teacherId, offset, limit }) {
    const pool = await conn;
    var sqlString =
      "SELECT t.id, t.[address], t.cmnd, t.[name], t.[email], t.phone, t.salary, t.[status], r.[name] roleName, t.role_id roleId, s.[name] schoolName, t.school_id schoolId FROM dbo.teacher t " +
      "INNER JOIN dbo.[role] r ON t.role_id = r.id " +
      "LEFT JOIN dbo.school s ON t.school_id = s.id " +
      "WHERE t.id = @teacherId ";
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("teacherId", sql.VarChar, teacherId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getTeacherIdFromContactBookId = async function ({ contactBookId }) {
    const pool = await conn;
    var sqlString =
      "SELECT dbo.GetIdTeacherFromIdContactBookId(@contactBookId) teacherId";
    return await pool.request()
      .input("contactBookId", sql.Int, contactBookId)
      .query(sqlString);
  };
};
