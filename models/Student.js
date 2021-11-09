//connect DB
const { conn, sql } = require("../config/db");
const bcrypt = require("bcryptjs");


module.exports = function () {
  this.getAll = async function (result) {
    const pool = await conn;
    var sqlString = "SELECT * FROM Student";
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
    var sqlString = "SELECT * FROM Student WHERE id = @id";
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
      "INSERT INTO dbo.Student(id, role_id, address, email, name, password, phone, status, createDay, updateDay) " +
      "VALUES (@id, @role_id, @address, @email, @name, @password, @phone, @status, @createDay, @updateDay)";
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
      .input("role_id", sql.VarChar, "STUDENT")
      .input("address", sql.VarChar, newData.address)
      .input("email", sql.VarChar, newData.email)
      .input("name", sql.NVarChar, newData.name)
      .input("password", sql.VarChar, newData.password)
      .input("phone", sql.VarChar, newData.phone)
      .input("status", sql.VarChar, newData.status)
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
      "UPDATE dbo.Student SET address = @address, email = @email, name = @name, password = @password, phone = @phone, status = @status, updateDay= @updateDay" +
      " WHERE id= @id";
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
      .input("address", sql.NVarChar, newData.address)
      .input("email", sql.VarChar, newData.email)
      .input("name", sql.VarChar, newData.name)
      .input("password", sql.VarChar, newData.password)
      .input("phone", sql.VarChar, newData.phone)
      .input("status", sql.VarChar, newData.status)
      .input("updateDay", sql.VarChar, Date.now())
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
    var sqlString = "DELETE FROM Student WHERE id = @id";
    return await pool
      .request()
      .input("id", sql.VarChar, id)
      .query(sqlString, function (err, data) {
        if (err) {
          result(true, null);
        } else {
          result(null, "Delete student success");
        }
      });
  };
};
