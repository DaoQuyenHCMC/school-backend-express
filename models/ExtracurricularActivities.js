//connect DB
const { conn, sql } = require("../config/db");
var Status = require("../common/core");

module.exports = function () {
  this.getAll = async function () {
    const pool = await conn;
    var sqlString = "SELECT * FROM ExtracurricularActivities";
    return await pool.request().query(sqlString);
  };

  this.getOne = async function (id) {
    const pool = await conn;
    var sqlString = "SELECT * FROM ExtracurricularActivities WHERE id = @id";
    return await pool
      .request()
      .input("id", sql.VarChar, id)
      .query(sqlString);
  };

  this.create = async function (newData) {
    const pool = await conn;
    var sqlString =
      "INSERT INTO dbo.ExtracurricularActivities(location, day, time, description, createDay, updateDay) VALUES(@location, @day, @time, @description, @createDay, @updateDay)";
    return await pool
      .request()
      .input("location", sql.NVarChar, newData.location)
      .input("day", sql.Date, newData.day)
      .input("time", sql.Time, newData.time)
      .input("description", sql.NVarChar, newData.description)
      .input("createDay", sql.DateTime, Date.now())
      .input("updateDay", sql.DateTime, Date.now())
      .query(sqlString);
  };

  this.update = async function (newData) {
    const pool = await conn;
    var sqlString =
      "UPDATE dbo.ExtracurricularActivities SET location = @location, day = @day, time = @time, description = @description, updateDay = @updateDay " +
      " WHERE id= @id";
    return await pool
      .request()
      .input("id", sql.Int, newData.id)
      .input("location", sql.NVarChar, newData.location)
      .input("day", sql.Date, newData.day)
      .input("time", sql.Time, newData.time)
      .input("description", sql.NVarChar, newData.description)
      .input("updateDay", sql.DateTime, Date.now())
      .query(sqlString);
  };

  this.delete = async function (id) {
    const pool = await conn;
    var sqlString = "DELETE FROM ExtracurricularActivities WHERE id = @id";
    return await pool
      .request()
      .input("id", sql.Int, id)
      .query(sqlString);
  };
  

};
