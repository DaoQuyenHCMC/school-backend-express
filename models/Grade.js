//connect DB
const { conn, sql } = require("../config/db");

module.exports = function () {


  const baseUrlPagination = "OFFSET (@offset-1)*@limit ROWS FETCH NEXT @limit ROWS ONLY ";

  this.getAllAdmin = async function ({ userId, gradeId, gradeName, limit, offset }) {
    const pool = await conn;
    var sqlString = "SELECT g.id, g.[name], g.school_id schoolId, s.[name] schoolName FROM dbo.grade g "
      + "INNER JOIN dbo.school s ON g.school_id = s.id "
      + "WHERE g.school_id = dbo.GetIdSchoolFromIdTeacher(@userId) ";
    if (gradeId || gradeName) {
      if (gradeId) {
        sqlString += "AND g.id = @gradeId ";
      }
      if (gradeName) {
        sqlString += "AND g.[name] = @gradeName ";
      }
    }
    sqlString += " ORDER BY g.id ";
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("userId", sql.VarChar, userId)
      .input("gradeName", sql.VarChar, gradeName)
      .input("gradeId", sql.Int, gradeId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  }

  this.getAllManager = async function ({ schoolId, gradeId, limit, offset }) {
    const pool = await conn;
    var sqlString = "SELECT g.id, g.[name], g.school_id schoolId, s.[name] schoolName FROM dbo.grade g "
      + "INNER JOIN dbo.school s ON g.school_id = s.id ";
    if (schoolId || gradeId) {
      sqlString += "WHERE ";

      if (schoolId) {
        sqlString += "g.school_id = @schoolId ";
      }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        gradeId
      ) {
        sqlString += "AND ";
      }

      if (gradeId) {
        sqlString += "g.id = @gradeId ";
      }
    }
    sqlString += " ORDER BY s.[name], g.[name] ";
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("schoolId", sql.VarChar, schoolId)
      .input("gradeId", sql.Int, gradeId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  }

  this.getOne = async function (id) {
    const pool = await conn;
    var sqlString = "SELECT id, [name], school_id schoolId FROM grade WHERE id = @id";
    return await pool
      .request()
      .input("id", sql.VarChar, id)
      .query(sqlString);
  }

  this.create = async function (newData) {
    const pool = await conn;
    var sqlString =
      "INSERT INTO dbo.Grade(school_id, name, create_day, update_day) VALUES(@schoolId,  N'" + newData.name + "', @createDay, @updateDay)";
    return await pool
      .request()
      .input("schoolId", sql.NVarChar, newData.schoolId)
      .input("createDay", sql.Date, Date.now())
      .input("updateDay", sql.Date, Date.now())
      .query(sqlString);
  };


  this.update = async function (newData) {
    const pool = await conn;
    var sqlString =
      "UPDATE dbo.Grade SET school_id = @schoolId," +
      " name =  N'" + newData.name + "', update_day = @updateDay" +
      " WHERE id= @id";
    console.log(sqlString);
    return await pool
      .request()
      .input("id", sql.Int, newData.id)
      .input("schoolId", sql.VarChar, newData.schoolId)
      .input("updateDay", sql.Date, Date.now())
      .query(sqlString);
  };

  this.delete = async function (id) {
    const pool = await conn;
    var sqlString = "DELETE FROM grade WHERE id = @id";
    return await pool
      .request()
      .input("id", sql.Int, id)
      .query(sqlString);
  }

  this.checkGradeIdAndTeacherId = async function ({ gradeId, teacherId }) {
    const pool = await conn;
    var sqlString =
      "SELECT 1 FROM dbo.Grade g " +
      " WHERE id = @gradeId AND school_id = dbo.GetIdSchoolFromIdTeacher(@teacherId)";
    return await pool.request()
      .input("teacherId", sql.VarChar, teacherId)
      .input("gradeId", sql.Int, gradeId)
      .query(sqlString);
  };
}