//connect DB
const { conn, sql } = require("../config/db");

module.exports = function () {

  const baseUrlStart = "SELECT c.id, c.[name], c.total, c.teacher_id teacherId, t.[name] teacherName, c.grade_id gradeId, g.[name] gradeName, s.[name] schoolName, t.school_id schoolId FROM dbo.class c " +
    " LEFT JOIN dbo.grade g ON g.id = c.grade_id " +
    " LEFT JOIN dbo.teacher t ON t.id = c.teacher_id " +
    " LEFT JOIN dbo.school s ON t.school_id = s.id ";

  const baseUrlPagination = "OFFSET (@offset-1)*@limit ROWS FETCH NEXT @limit ROWS ONLY ";

  this.getAllManager = async function ({
    gradeId,
    teacherId,
    schoolId,
    classId,
    offset,
    limit,
    className
  }) {
    const pool = await conn;
    var sqlString = baseUrlStart;
    if (gradeId || teacherId || schoolId || classId || className) {
      sqlString += "WHERE ";

      if (gradeId) {
        sqlString += " c.grade_id = @gradeId ";
      }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        teacherId
      ) {
        sqlString += "AND ";
      }

      if (teacherId) {
        sqlString += " c.teacher_id = @teacherId ";
      }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        schoolId
      ) {
        sqlString += "AND ";
      }

      if (schoolId) {
        sqlString += " t.school_id = @schoolId ";
      }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        classId
      ) {
        sqlString += "AND ";
      }

      if (classId) {
        sqlString += " c.id = @classId ";
      }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        className
      ) {
        sqlString += "AND ";
      }

      if (className) {
        sqlString += " c.name like '%" + className + "%' ";
      }
    }

    sqlString += " ORDER BY s.[name], g.[name], c.[name] ";
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("gradeId", sql.Int, gradeId)
      .input("classId", sql.Int, classId)
      .input("schoolId", sql.VarChar, schoolId)
      .input("teacherId", sql.VarChar, teacherId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getAll = async function ({
    gradeId,
    teacherId,
    schoolId,
    limit,
    offset
  }) {
    const pool = await conn;
    var sqlString =
      "SELECT c.id, c.[name], c.total, c.teacher_id teacherId, t.[name] teacherName, c.grade_id gradeId, g.[name] gradeName, s.[name] schoolName, t.school_id schoolId FROM dbo.class c " +
      " LEFT JOIN dbo.grade g ON g.id = c.grade_id " +
      " LEFT JOIN dbo.teacher t ON t.id = c.teacher_id " +
      " LEFT JOIN dbo.school s ON t.school_id = s.id ";
    if (gradeId || teacherId || schoolId) {
      sqlString += "WHERE ";

      if (gradeId) {
        sqlString += " c.grade_id = '" + gradeId + "' ";
      }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        teacherId
      ) {
        sqlString += "AND ";
      }

      if (teacherId) {
        sqlString += " c.teacher_id = '" + teacherId + "' ";
      }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        schoolId
      ) {
        sqlString += "AND ";
      }

      if (schoolId) {
        sqlString += " t.school_id = '" + schoolId + "' ";
      }
    }

    sqlString += " ORDER BY s.[name], g.[name], c.[name] ";
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.checkExist = async function (gradeId, name) {
    const pool = await conn;
    var sqlString =
      "SELECT 1 FROM dbo.class c " +
      " LEFT JOIN dbo.grade g ON g.id = c.grade_id " +
      " WHERE c.[name] = @name AND c.grade_id = @gradeId";
    return await pool.request()
      .input("name", sql.NVarChar, name)
      .input("gradeId", sql.Int, gradeId)
      .query(sqlString);
  };

  this.getOne = async function (id) {
    const pool = await conn;
    var sqlString =
      "SELECT c.id, c.[name], c.total, c.teacher_id teacherId, t.[name] teacherName, c.grade_id gradeId, g.[name] gradeName, s.[name] schoolName, t.school_id schoolId FROM dbo.class c " +
      " LEFT JOIN dbo.grade g ON g.id = c.grade_id " +
      " LEFT JOIN dbo.teacher t ON t.id = c.teacher_id " +
      " LEFT JOIN dbo.school s ON t.school_id = s.id WHERE c.id = @id";
    return await pool.request().input("id", sql.Int, id).query(sqlString);
  };

  this.getNameClassByStudentId = async function (id) {
    const pool = await conn;
    var sqlString =
      "SELECT c.[name], c.id FROM dbo.class c " +
      "LEFT JOIN dbo.student s ON s.class_id = c.id " +
      "WHERE s.id = @id";
    return await pool.request().input("id", sql.VarChar, id).query(sqlString);
  };

  this.getNameClassByClassId = async function (id) {
    const pool = await conn;
    var sqlString =
      "SELECT c.[name], c.id FROM dbo.class c " +
      "WHERE id = @id";
    return await pool.request().input("id", sql.VarChar, id).query(sqlString);
  };


  this.updateTotal = async function (id) {
    const pool = await conn;
    var sqlString =
      "UPDATE dbo.class " +
      " SET total = dbo.UpdateSiSoLop(@id) " +
      " WHERE id = @id ";
    return await pool.request().input("id", sql.Int, id).query(sqlString);
  };

  this.create = async function (newData) {
    const pool = await conn;
    var sqlString =
      "INSERT INTO dbo.Class(grade_id, teacher_id, name, total, create_day, update_day) VALUES(@gradeId, @teacherId, N'" +
      newData.name +
      "', @total, @createDay, @updateDay)";
    return await pool
      .request()
      .input("gradeId", sql.Int, newData.gradeId)
      .input("teacherId", sql.VarChar, newData.teacherId)
      .input("total", sql.Int, newData.total)
      .input("createDay", sql.Date, Date.now())
      .input("updateDay", sql.Date, Date.now())
      .query(sqlString);
  };

  this.update = async function (newData) {
    const pool = await conn;
    var sqlString =
      "UPDATE dbo.Class SET grade_id = @gradeId, teacher_id = @teacherId, name = N'" +
      newData.name +
      "', total = @total,update_day = @updateDay" +
      " WHERE id= @id";
    console.log(sqlString);
    return await pool
      .request()
      .input("id", sql.Int, newData.id)
      .input("gradeId", sql.Int, newData.gradeId)
      .input("teacherId", sql.VarChar, newData.teacherId)
      .input("total", sql.Int, newData.total)
      .input("updateDay", sql.Date, Date.now())
      .query(sqlString);
  };

  this.delete = async function (id) {
    const pool = await conn;
    var sqlString = "DELETE FROM class WHERE id = @id";
    return await pool.request().input("id", sql.VarChar, id).query(sqlString);
  };

  this.resetTeacher = async function ({
    classId,
    gradeId,
    teacherId,
    schoolId,
  }) {
    const pool = await conn;
    var sqlString = "update dbo.class set teacher_id = null ";
    if (classId || gradeId || teacherId || schoolId) {
      sqlString += "WHERE ";

      if (classId) {
        sqlString += " id = @classId ";
      }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        gradeId
      ) {
        sqlString += "AND ";
      }

      if (gradeId) {
        sqlString += " grade_id = @gradeId ";
      }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        teacherId
      ) {
        sqlString += "AND ";
      }

      if (teacherId) {
        sqlString += " teacher_id = @teacherId ";
      }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        schoolId
      ) {
        sqlString += "AND ";
      }

      if (schoolId) {
        sqlString +=
          " grade_id IN (select id from dbo.grade where school_id = @schoolId) ";
      }
    }
    return await pool.request()
      .input("gradeId", sql.Int, gradeId)
      .input("classId", sql.Int, classId)
      .input("schoolId", sql.VarChar, schoolId)
      .input("teacherId", sql.VarChar, teacherId)
      .query(sqlString);
  };

  this.getAllAdmin = async function ({
    gradeId,
    teacherId,
    classId,
    userId,
    limit,
    offset,
    className
  }) {
    const pool = await conn;
    var sqlString =
      "SELECT c.id, c.[name], c.total, c.teacher_id teacherId, t.[name] teacherName, c.grade_id gradeId, g.[name] gradeName, s.[name] schoolName, t.school_id schoolId FROM dbo.class c " +
      " LEFT JOIN dbo.grade g ON g.id = c.grade_id " +
      " LEFT JOIN dbo.teacher t ON t.id = c.teacher_id " +
      " LEFT JOIN dbo.school s ON t.school_id = s.id " +
      " WHERE g.school_id = dbo.GetIdSchoolFromIdTeacher(@userId) ";
    if (gradeId) sqlString += "AND c.grade_id = @gradeId ";
    if (teacherId) sqlString += "AND c.teacher_id = @teacherId ";
    if (classId) sqlString += "AND c.id = @classId ";
    if (className) sqlString += "AND c.name like '%" + className + "%' ";
    sqlString += " ORDER BY g.[name], c.[name] ";
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("gradeId", sql.Int, gradeId)
      .input("classId", sql.Int, classId)
      .input("teacherId", sql.VarChar, teacherId)
      .input("userId", sql.VarChar, userId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getAllTeacher = async function ({
    gradeId,
    classId,
    userId,
    limit,
    offset
  }) {
    const pool = await conn;
    var sqlString =
      "SELECT c.id, c.[name], c.total, c.teacher_id teacherId, t.[name] teacherName, c.grade_id gradeId, g.[name] gradeName, s.[name] schoolName, t.school_id schoolId FROM dbo.class c " +
      " LEFT JOIN dbo.grade g ON g.id = c.grade_id " +
      " LEFT JOIN dbo.teacher t ON t.id = c.teacher_id " +
      " LEFT JOIN dbo.school s ON t.school_id = s.id " +
      " WHERE g.school_id = dbo.GetIdSchoolFromIdTeacher(@userId) AND c.teacher_id = @userId ";
    if (gradeId || classId) {
      if (gradeId) {
        sqlString += "AND c.grade_id = @gradeId ";
      }

      if (classId) {
        sqlString += "AND c.id = @classId ";
      }
    }

    sqlString += " ORDER BY g.[name], c.[name] ";
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("gradeId", sql.Int, gradeId)
      .input("classId", sql.Int, classId)
      .input("userId", sql.VarChar, userId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getIdSchoolFromIdClass = async function ({ classId }) {
    const pool = await conn;
    var sqlString =
      "SELECT dbo.GetIdSchoolFromIdClass(@classId) schoolId";
    return await pool.request()
      .input("classId", sql.Int, classId)
      .query(sqlString);
  };

  this.checkClassOfSchoolTeacher = async function ({ classId, schoolId, teacherId }) {
    const pool = await conn;
    var sqlString = "SELECT 1 FROM dbo.class c " +
      " LEFT JOIN dbo.grade g ON g.id = c.grade_id " +
      " LEFT JOIN dbo.teacher t ON t.id = c.teacher_id " +
      " WHERE (g.school_id = @schoolId or t.school_id = @schoolId) "
    if (teacherId && classId) {
      sqlString += "and (t.id = @teacherId or c.id = @classId) ";
    } else if (teacherId) {
      sqlString += "and t.id = @teacherId ";
    } else if (classId) {
      sqlString += "and c.id = @classId ";
    }
    return await pool.request()
      .input("classId", sql.Int, classId)
      .input("schoolId", sql.VarChar, schoolId)
      .input("teacherId", sql.VarChar, teacherId)
      .query(sqlString);
  };
};
