//connect DB
const { conn, sql } = require("../config/db");
const bcrypt = require("bcryptjs");


module.exports = function () {
  this.getAll = async function (result) {
    const pool = await conn;
    var sqlString = "SELECT * FROM Teacher";
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
    var sqlString = "SELECT * FROM Teacher WHERE id = @id";
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
      "INSERT INTO dbo.Teacher(id, name, address, cmnd, email, password, phone, role_id, salary, schoolId, status, createBy, createDay, updateDay, lastModifyBy) " +
      "VALUES (@id, @name, @address, @cmnd, @email, @password, @phone, @role_id, @salary, @schoolId, @status, @createBy, @createDay, @updateDay, @lastModifyBy)";
    bcrypt.hash(newData.password, 10, function (error, hass) {
      if (error) {
        result(true, null);
      } else {
        newData.password = hass;
      }
    });
    return await pool
      .request()
      .input("id", sql.VarChar, newData.id)
      .input("name", sql.NVarChar, newData.name)
      .input("address", sql.VarChar, newData.address)
      .input("cmnd", sql.VarChar, newData.cmnd)
      .input("email", sql.VarChar, newData.email)
      .input("password", sql.VarChar, newData.password)
      .input("phone", sql.VarChar, newData.phone)
      .input("role_id", sql.VarChar, "STUDENT")
      .input("salary", sql.Money, newData.salary)
      .input("schoolId", sql.VarChar, newData.schoolId)
      .input("status", sql.VarChar, newData.status)
      .input("createBy", sql.VarChar, newData.createBy)
      .input("lastModifyBy", sql.VarChar, newData.lastModifyBy)
      .input("createDay", sql.DateTime, Date.now())
      .input("updateDay", sql.DateTime, Date.now())
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
      "UPDATE dbo.Teacher SET name = @name, address = @address, cmnd = @cmnd, email = @email, password = @password, " +
      "phone = @phone, role_id = @role_id, salary = @salary, schoolId = @schoolId, status = @status, updateDay = @updateDay, lastModifyBy = @lastModifyBy" +
      " WHERE id= @id";
    console.log(sqlString);
    return await pool
      .request()
      .input("name", sql.NVarChar, newData.name)
      .input("address", sql.VarChar, newData.address)
      .input("cmnd", sql.VarChar, newData.cmnd)
      .input("email", sql.VarChar, newData.email)
      .input("password", sql.VarChar, newData.password)
      .input("phone", sql.VarChar, newData.phone)
      .input("role_id", sql.VarChar, "STUDENT")
      .input("salary", sql.Money, newData.salary)
      .input("schoolId", sql.VarChar, newData.schoolId)
      .input("status", sql.VarChar, newData.status)
      .input("lastModifyBy", sql.VarChar, newData.lastModifyBy)
      .input("updateDay", sql.DateTime, Date.now())
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
    var sqlString = "DELETE FROM Teacher WHERE id = @id";
    return await pool
      .request()
      .input("id", sql.VarChar, id)
      .query(sqlString, function (err, data) {
        if (err) {
          result(true, null);
        } else {
          result(null, "Delete teacher success");
        }
      });
  };
};
