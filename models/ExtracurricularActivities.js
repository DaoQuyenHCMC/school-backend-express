//connect DB
const { conn, sql } = require("../config/db");
var Status = require("../common/core");

module.exports = function () {

  const baseUrlPagination = "OFFSET (@offset-1)*@limit ROWS FETCH NEXT @limit ROWS ONLY ";

  this.getAll = async function ({schoolId, offset, limit}) {
    const pool = await conn;
    var sqlString = "SELECT title, location, day, e.description extracurricularActivitiesDescription, s.id schoolId, s.address schoolAddress, s.description schoolDescription, s.name schoolName, e.id, type FROM extracurricular_activities e"
     + " LEFT JOIN dbo.School s ON school_id = s.id ";

    if (schoolId) {
      sqlString += "WHERE ";

      if (schoolId) {
        sqlString += " school_id = '" + schoolId + "' ";
      }
    }
    sqlString += " ORDER BY s.[name], title ";
    if(limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
    .input("offset", sql.Int, offset)
    .input("limit", sql.Int, limit)
    .query(sqlString);
  };

  this.getAllAdmin = async function ({schoolId, userId, extraId, offset, limit}) {
    const pool = await conn;
    var sqlString = "SELECT title, location, day, e.description extracurricularActivitiesDescription, s.id schoolId, s.address schoolAddress, s.description schoolDescription, s.name schoolName, e.id, type FROM extracurricular_activities e"
     + " LEFT JOIN dbo.School s ON school_id = s.id "
     + " WHERE school_id = dbo.GetIdSchoolFromIdTeacher(@userId) ";

    if (schoolId || extraId) {
      if (schoolId) {
        sqlString += "AND school_id = @schoolId ";
      }

      if (extraId) {
        sqlString += "AND e.id = @extraId ";
      }
    }
    sqlString += " ORDER BY s.[name], title";
    if(limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
    .input("schoolId", sql.VarChar, schoolId)
    .input("userId", sql.VarChar, userId)
    .input("extraId", sql.VarChar, extraId)
    .input("offset", sql.Int, offset)
    .input("limit", sql.Int, limit)
    .query(sqlString);
  };

  this.getOne = async function (id) {
    const pool = await conn;
    var sqlString =  "SELECT title, location, day, e.description extracurricularActivitiesDescription, s.id schoolId, s.address schoolAddress, s.description schoolDescription, s.name schoolName, type, e.id FROM extracurricular_activities e"
    + " LEFT JOIN dbo.School s ON school_id = s.id WHERE e.id = @id";
    return await pool
      .request()
      .input("id", sql.Int, id)
      .query(sqlString);
  };

  this.create = async function (newData) {
    const pool = await conn;
    var sqlString =
      "INSERT INTO dbo.extracurricular_activities(title, location, day, description, school_id) VALUES(N'" +
      newData.title +
      "', N'"+ newData.location +"', @day, N'"+ newData.description +"', @schoolId)";
    return await pool
      .request()
      .input("schoolId", sql.VarChar, newData.schoolId)
      .input("day", sql.Date, newData.day)
      .query(sqlString);
  };

  this.update = async function (newData) {
    const pool = await conn;
    var sqlString =
      "UPDATE dbo.extracurricular_activities SET title =  N'" +
      newData.title +
      "', location = N'"+ newData.location +"', day = @day, description = N'"+ newData.description +"', school_id = @schoolId " +
      " WHERE id= @id";
    return await pool
      .request()
      .input("id", sql.Int, newData.id)
      .input("schoolId", sql.VarChar, newData.schoolId)
      .input("day", sql.Date, newData.day)
      .query(sqlString);
  };

  this.delete = async function (id) {
    const pool = await conn;
    var sqlString = "DELETE FROM extracurricular_activities WHERE id = @id";
    return await pool
      .request()
      .input("id", sql.Int, id)
      .query(sqlString);
  };
  

};
