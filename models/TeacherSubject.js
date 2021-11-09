//connect DB
const { conn, sql } = require("../config/db");


module.exports = function () {
  this.getAll = async function (result) {
    const pool = await conn;
    var sqlString = "SELECT * FROM TeacherSubject";
    return await pool.request().query(sqlString, function (err, data) {
      if (data.recordset.length > 0) {
        result(null, data.recordset);
      } else {
        result(true, null);
      }
    });
  };

  this.getOne = async function (id, result) {
    const pool = await conn;
    var sqlString = "SELECT * FROM TeacherSubject WHERE id = @id";
    return await pool
      .request()
      .input("id", sql.VarChar, id)
      .query(sqlString, function (err, data) {
        if (data.recordset.length > 0) {
          result(null, data.recordset);
        } else {
          result(true, null);
        }
      });
  };

  this.create = async function (newData, result) {
    const pool = await conn;
    var sqlString =
      "INSERT INTO dbo.TeacherSubject(classId, subjectId, teacherId, semesterId) " +
      "VALUES (@studentId, @subjectId, @teacherId, @semesterId)";
    return await pool
      .request()
      .input("classId", sql.VarChar, newData.classId)
      .input("subjectId", sql.VarChar, newData.subjectId)
      .input("teacherId", sql.VarChar, newData.teacherId)
      .input("semesterId", sql.VarChar, newData.semesterId)
      .query(sqlString, function (err, data) {
        console.log(err);
        if (err) {
          result(true, null);
        } else {
          result(null, data);
        }
      });
  };

  this.update = async function (newData, result) {
    const pool = await conn;
    var sqlString =
      "UPDATE dbo.TeacherSubject SET classId = @classId, subjectId = @subjectId, teacherId = @teacherId, semesterId = @semesterId"
    console.log(sqlString);
    return await pool
      .request()
      .input("classId", sql.VarChar, newData.classId)
      .input("subjectId", sql.VarChar, newData.subjectId)
      .input("teacherId", sql.VarChar, newData.teacherId)
      .input("semesterId", sql.VarChar, newData.semesterId)
      .query(sqlString, function (err, data) {
        if (err) {
          result(true, null);
        } else {
          result(null, newData);
        }
      });
  };

  this.delete = async function (id, result) {
    const pool = await conn;
    var sqlString = "DELETE FROM TeacherSubject WHERE classId = @classId, subjectId = @subjectId, teacherId = @teacherId, semesterId = @semesterId";
    return await pool
      .request()
      .input("id", sql.VarChar, id)
      .query(sqlString, function (err, data) {
        if (err) {
          result(true, null);
        } else {
          result(null, "Delete TeacherSubject success");
        }
      });
  };
};
