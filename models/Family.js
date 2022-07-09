//connect DB
const { conn, sql } = require("../config/db");

module.exports = function () {
  const baseUrlStart = "SELECT [cmnd] , f.[name], f.[phone], f.[email], f.[role_id] roldId, r.[name] roleName FROM Family f "
    + " LEFT JOIN dbo.role r ON f.role_id = r.id ";

  const baseUrlPagination = "OFFSET (@offset-1)*@limit ROWS FETCH NEXT @limit ROWS ONLY ";
  const baseUrlEndAdmin = " ORDER BY name "
  this.getAll = async function ({
    cmnd,
    email,
    offset,
    limit }) {
    const pool = await conn;
    var sqlString = baseUrlStart;
    if (cmnd || email) {
      sqlString += "WHERE ";
      if (email) sqlString += "AND email = @email "
      if (sqlString.substring(sqlString.length - 6, sqlString.length - 1) !== "WHERE" && cmnd) sqlString += "AND ";
      if (cmnd) sqlString += " cmnd = @cmnd ";
    }
    sqlString += baseUrlEndAdmin;

    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("cmnd", sql.VarChar, cmnd)
      .input("email", sql.NVarChar, email)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  }

  this.getOne = async function (cmnd) {
    const pool = await conn;
    var sqlString = "SELECT * FROM Family WHERE cmnd = @cmnd";
    return await pool
      .request()
      .input("cmnd", sql.VarChar, cmnd)
      .query(sqlString);
  }

  this.create = async function (newData) {
    const pool = await conn;
    var sqlString =
      "INSERT INTO dbo.Family(cmnd, name, phone, password, email) VALUES (@cmnd, N'" + newData.name + "', @phone, @password, @email)";
    return await pool
      .request()
      .input("cmnd", sql.VarChar, newData.cmnd)
      .input("phone", sql.VarChar, newData.phone)
      .input("studentId", sql.NVarChar, newData.studentId)
      .input("password", sql.NVarChar, newData.password)
      .input("email", sql.NVarChar, newData.email)
      .query(sqlString);
  };


  this.update = async function (newData) {
    const pool = await conn;
    var sqlString =
      "UPDATE dbo.Family SET name = N'" + newData.name + "', phone = @phone, " +
      "password = @password, email = @email " +
      " WHERE cmnd = @cmnd";
    console.log(sqlString);
    return await pool
      .request()
      .input("cmnd", sql.VarChar, newData.cmnd)
      .input("password", sql.VarChar, newData.password)
      .input("email", sql.VarChar, newData.email)
      .input("phone", sql.VarChar, newData.phone)
      .query(sqlString);
  };

  this.delete = async function (cmnd, result) {
    const pool = await conn;
    var sqlString = "DELETE FROM Family WHERE cmnd = @cmnd";
    return await pool
      .request()
      .input("cmnd", sql.VarChar, cmnd)
      .query(sqlString);
  }

  this.checkEmail = async function (email) {
    const pool = await conn;
    var sqlString = "SELECT 1 FROM dbo.Family WHERE email = @email";
    return await pool
      .request()
      .input("email", sql.VarChar, email)
      .query(sqlString);
  };
}