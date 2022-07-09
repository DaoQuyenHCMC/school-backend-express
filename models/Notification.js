//connect DB
const { conn, sql } = require("../config/db");

module.exports = function () {

  const baseUrlStart = "SELECT n.school_id schoolId, s.address schoolAddress, s.description schoolDescription, s.name schoolName, type, "
    + "n.id idNotification, n.object, n.create_by createBy, n.approve_by approveBy, n.status statusNotification, "
    + "n.title titleNotification, n.description descriptionNotification, n.start_day startDay, n.end_day endDay, "
    + "e.title titleExtracurricularActivities, e.id idExtracurricularActivities, e.description descriptionExtracurricularActivities, e.day "
    + "FROM notification n "
    + "LEFT JOIN dbo.extracurricular_activities e ON e.id = n.extracurricular_activities_id "
    + "LEFT JOIN dbo.school s ON n.school_id = s.id ";

  const baseUrlEndAdmin = "ORDER BY n.create_day DESC, e.title ASC, n.title ASC "

  const baseUrlPagination = "OFFSET (@offset-1)*@limit ROWS FETCH NEXT @limit ROWS ONLY ";

  this.getAll = async function ({ extracurricularActivitiesId, schoolId, notificationId, offset, limit }) {
    const pool = await conn;
    var sqlString = baseUrlStart + "WHERE n.status = 'APPROVE' ";
    if (extracurricularActivitiesId) sqlString += "n.extracurricular_activities_id = @extracurricularActivitiesId ";
    if (schoolId) sqlString += "and n.school_id = @schoolId ";
    if (notificationId) sqlString += "and n.id = @notificationId ";
    sqlString += baseUrlEndAdmin;
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("extracurricularActivitiesId", sql.Int, extracurricularActivitiesId)
      .input("schoolId", sql.VarChar, schoolId)
      .input("notificationId", sql.Int, notificationId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getAllManager = async function ({ extracurricularActivitiesId, schoolId, notificationId, status, offset, limit }) {
    const pool = await conn;
    var sqlString = baseUrlStart + "WHERE (n.approve_by = 'MANAGER' or n.approve_by is null) ";
    if (schoolId) sqlString += "and n.school_id = @schoolId ";
    if (extracurricularActivitiesId) sqlString += "and n.extracurricular_activities_id = @extracurricularActivitiesId ";
    if (notificationId) sqlString += "and n.id = @notificationId ";
    if (status) sqlString += "and n.status = @status ";
    sqlString += "ORDER BY n.create_by, s.id, s.[name], e.title, n.title ";
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("extracurricularActivitiesId", sql.Int, extracurricularActivitiesId)
      .input("schoolId", sql.VarChar, schoolId)
      .input("status", sql.VarChar, status)
      .input("notificationId", sql.Int, notificationId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getAllAdmin = async function ({ extracurricularActivitiesId, schoolId, userId, notificationId, approveBy, offset, limit }) {
    const pool = await conn;
    var sqlString = baseUrlStart + " WHERE n.school_id = dbo.GetIdSchoolFromIdTeacher(@userId) ";
    if (extracurricularActivitiesId) sqlString += "AND n.extracurricular_activities_id = @extracurricularActivitiesId ";
    if (schoolId) sqlString += "AND n.school_id = @schoolId ";
    if (notificationId) sqlString += "AND n.id = @notificationId ";
    if (approveBy) sqlString += "AND n.approve_by = @approveBy ";
    sqlString += baseUrlEndAdmin;
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("extracurricularActivitiesId", sql.Int, extracurricularActivitiesId)
      .input("schoolId", sql.VarChar, schoolId)
      .input("userId", sql.VarChar, userId)
      .input("approveBy", sql.VarChar, approveBy)
      .input("notificationId", sql.Int, notificationId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getAllStudent = async function ({ extracurricularActivitiesId, schoolId, userId, notificationId, status, offset, limit }) {
    const pool = await conn;
    var sqlString = baseUrlStart + " WHERE (n.school_id = dbo.GetIdSchoolFromIdStudent(@userId) or n.school_id is null) and object in ('1','6', , @userId) and n.status = 'APPROVE' ";
    if (status) sqlString += "and n.status = @status ";
    if (extracurricularActivitiesId) sqlString += "AND n.extracurricular_activities_id = @extracurricularActivitiesId ";
    if (notificationId) sqlString += "AND n.id = @notificationId ";
    sqlString += baseUrlEndAdmin;
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("extracurricularActivitiesId", sql.Int, extracurricularActivitiesId)
      .input("schoolId", sql.VarChar, schoolId)
      .input("userId", sql.VarChar, userId)
      .input("notificationId", sql.Int, notificationId)
      .input("status", sql.VarChar, status)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getAllFamily = async function ({ extracurricularActivitiesId, userId, notificationId, status, offset, limit }) {
    const pool = await conn;
    var sqlString = baseUrlStart + " WHERE object in ('5', @userId) and n.status = 'APPROVE' ";
    if (status) sqlString += "and n.status = @status ";
    if (extracurricularActivitiesId) sqlString += "AND n.extracurricular_activities_id = @extracurricularActivitiesId ";
    if (notificationId) sqlString += "AND n.id = @notificationId ";
    sqlString += baseUrlEndAdmin;
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("extracurricularActivitiesId", sql.Int, extracurricularActivitiesId)
      .input("userId", sql.VarChar, userId)
      .input("notificationId", sql.Int, notificationId)
      .input("status", sql.VarChar, status)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getAllStudentRequest = async function ({ extracurricularActivitiesId, userId, notificationId, status, offset, limit }) {
    const pool = await conn;
    var sqlString = baseUrlStart + " WHERE n.create_by = @userId ";
    if (status) sqlString += "and n.status = @status ";
    if (extracurricularActivitiesId) sqlString += "AND n.extracurricular_activities_id = @extracurricularActivitiesId ";
    if (notificationId) sqlString += "AND n.id = @notificationId ";
    sqlString += baseUrlEndAdmin;
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("extracurricularActivitiesId", sql.Int, extracurricularActivitiesId)
      .input("userId", sql.VarChar, userId)
      .input("notificationId", sql.Int, notificationId)
      .input("status", sql.VarChar, status)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getAllFamilyRequest = async function ({ extracurricularActivitiesId, userId, notificationId, status, offset, limit }) {
    const pool = await conn;
    var sqlString = baseUrlStart + " WHERE n.create_by = @userId ";
    if (status) sqlString += "and n.status = @status ";
    if (extracurricularActivitiesId) sqlString += "AND n.extracurricular_activities_id = @extracurricularActivitiesId ";
    if (notificationId) sqlString += "AND n.id = @notificationId ";
    sqlString += baseUrlEndAdmin;
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("extracurricularActivitiesId", sql.Int, extracurricularActivitiesId)
      .input("userId", sql.VarChar, userId)
      .input("notificationId", sql.Int, notificationId)
      .input("status", sql.VarChar, status)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getAllTeacher = async function ({ extracurricularActivitiesId, userId, notificationId, status, offset, limit }) {
    const pool = await conn;
    var sqlString = baseUrlStart + " WHERE (n.school_id = dbo.GetIdSchoolFromIdTeacher(@userId) or n.school_id is null) and object in ('2', '6', '7', @userId) and n.status = 'APPROVE' ";
    if (status) sqlString += "and n.status = @status ";
    if (extracurricularActivitiesId) sqlString += "AND n.extracurricular_activities_id = @extracurricularActivitiesId ";
    if (notificationId) sqlString += "AND n.id = @notificationId ";
    sqlString += baseUrlEndAdmin;
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("extracurricularActivitiesId", sql.Int, extracurricularActivitiesId)
      .input("userId", sql.VarChar, userId)
      .input("notificationId", sql.Int, notificationId)
      .input("status", sql.VarChar, status)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getAllTeacherRequest = async function ({ extracurricularActivitiesId, userId, notificationId, status, offset, limit }) {
    const pool = await conn;
    var sqlString = baseUrlStart + " WHERE n.create_by = @userId ";
    if (status) sqlString += "and n.status = @status ";
    if (extracurricularActivitiesId) sqlString += "AND n.extracurricular_activities_id = @extracurricularActivitiesId ";
    if (notificationId) sqlString += "AND n.id = @notificationId ";
    sqlString += baseUrlEndAdmin;
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("extracurricularActivitiesId", sql.Int, extracurricularActivitiesId)
      .input("userId", sql.VarChar, userId)
      .input("notificationId", sql.Int, notificationId)
      .input("status", sql.VarChar, status)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getAllForAdmin = async function ({ extracurricularActivitiesId, schoolId, userId, notificationId, offset, limit }) {
    const pool = await conn;
    var sqlString = baseUrlStart + " WHERE (n.school_id = dbo.GetIdSchoolFromIdTeacher(@userId) or n.school_id is null) and object in ('3','7') and n.status = 'APPROVE' " + baseUrlEndAdmin;
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("extracurricularActivitiesId", sql.Int, extracurricularActivitiesId)
      .input("schoolId", sql.VarChar, schoolId)
      .input("userId", sql.VarChar, userId)
      .input("notificationId", sql.Int, notificationId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getAllRequestAdmin = async function ({ userId, status, purpose, offset, limit }) {
    const pool = await conn;
    var sqlString = baseUrlStart + " WHERE n.school_id = dbo.GetIdSchoolFromIdTeacher(@userId) and " +
      (purpose === "to" ? "approve_by = 'ADMIN' " : "n.create_by = @userId ");
    if (status) sqlString += "and n.status = @status ";
    sqlString += baseUrlEndAdmin;
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("userId", sql.VarChar, userId)
      .input("status", sql.VarChar, status)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getAllRequestAdminFromTeacher = async function ({ userId, status, offset, limit }) {
    const pool = await conn;
    var sqlString = baseUrlStart + "inner join dbo.teacher t on t.id = n.create_by "
      + "where t.role_id = 'TEACHER' and approve_by = 'ADMIN' "
      + "and t.school_id = dbo.GetIdSchoolFromIdTeacher(n.create_by)";
    if (status) sqlString += "and n.status = @status ";
    sqlString += baseUrlEndAdmin;
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("userId", sql.VarChar, userId)
      .input("status", sql.VarChar, status)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getAllRequestAdminFromStudent = async function ({ userId, status, offset, limit }) {
    const pool = await conn;
    var sqlString = baseUrlStart + "inner join dbo.student st on st.id = n.create_by "
      + "where st.role_id = 'STUDENT' and approve_by = 'ADMIN' "
      + "and st.school_id = dbo.GetIdSchoolFromIdStudent(n.create_by) ";
    if (status) sqlString += "and n.status = @status ";
    sqlString += baseUrlEndAdmin;
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("userId", sql.VarChar, userId)
      .input("status", sql.VarChar, status)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };


  this.getOne = async function (id) {
    const pool = await conn;
    var sqlString = baseUrlStart + " WHERE n.id = @id";
    return await pool.request().input("id", sql.Int, id).query(sqlString);
  };

  this.getByExtracurricularActivitiesId = async function (id) {
    const pool = await conn;
    var sqlString =
      "SELECT * FROM notification WHERE extracurricular_activities_id = @extracurricularActivitiesId";
    return await pool
      .request()
      .input("extracurricularActivitiesId", sql.Int, id)
      .query(sqlString);
  };

  this.create = async function (newData) {
    const pool = await conn;
    var sqlString =
      "INSERT INTO dbo.notification(title, description, extracurricular_activities_id, school_id, start_day, end_day, object, create_by, approve_by, create_day ";
    if (newData.status) {
      sqlString += ", status ";
    }
    sqlString += ") VALUES( N'" + newData.title + "',  N'" + newData.description +
      "', @extracurricularActivitiesId, @schoolId, @startDay, @endDay, @object, @createBy, @approveBy, @createDay";
    if (newData.status) {
      sqlString += ", @status ";
    }
    sqlString += ")";
    return await pool
      .request()
      .input("extracurricularActivitiesId", sql.Int, newData.extracurricularActivitiesId)
      .input("object", sql.VarChar, newData.object)
      .input("schoolId", sql.VarChar, newData.schoolId)
      .input("createBy", sql.VarChar, newData.createBy)
      .input("approveBy", sql.VarChar, newData.approveBy)
      .input("status", sql.VarChar, newData.status || 'default')
      .input("startDay", sql.Date, newData.startDay)
      .input("createDay", sql.Date, Date.now())
      .input("endDay", sql.Date, newData.endDay)
      .query(sqlString);
  };

  this.update = async function (newData) {
    const pool = await conn;
    var sqlString =
      "UPDATE dbo.notification SET title =  N'" +
      newData.title +
      "', description = N'" +
      newData.description +
      "', extracurricular_activities_id = @extracurricularActivitiesId, " +
      "school_id = @schoolId, start_day = @startDay, end_day = @endDay, status = @status, object = @object " +
      " WHERE id= @id";
    return await pool
      .request()
      .input(
        "extracurricularActivitiesId",
        sql.Int,
        newData.extracurricularActivitiesId
      )
      .input("id", sql.VarChar, newData.id)
      .input("schoolId", sql.VarChar, newData.schoolId)
      .input("status", sql.VarChar, newData.status)
      .input("startDay", sql.Date, newData.startDay)
      .input("endDay", sql.Date, newData.endDay)
      .input("object", sql.Int, newData.object)
      .query(sqlString);
  };

  this.approve = async function (status, id) {
    const pool = await conn;
    var sqlString =
      "UPDATE dbo.notification SET status = @status " +
      " WHERE id= @id";
    return await pool
      .request()
      .input("id", sql.VarChar, id)
      .input("status", sql.VarChar, status)
      .query(sqlString);
  };

  this.delete = async function (id) {
    const pool = await conn;
    var sqlString = "DELETE FROM notification WHERE id = @id";
    return await pool.request().input("id", sql.VarChar, id).query(sqlString);
  };

  this.checkExisted = async function (id) {
    const pool = await conn;
    var sqlString = "SELECT 1 FROM notification WHERE id = @id";
    return await pool.request().input("id", sql.Int, id).query(sqlString);
  };
};
