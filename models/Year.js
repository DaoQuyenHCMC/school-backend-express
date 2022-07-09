//connect DB
const { conn, sql } = require("../config/db");

module.exports = function () {
  const baseUrlPagination = "OFFSET (@offset-1)*@limit ROWS FETCH NEXT @limit ROWS ONLY ";
  this.getAll = async function ({name, offset, limit}) {
    const pool = await conn;
    var sqlString = "SELECT * FROM dbo.school_year ";
    if(name){
      sqlString += "WHERE name = '" + name + "' ";
    }
    sqlString += "ORDER BY name ";
    if(limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
    .input("offset", sql.Int, offset)
    .input("limit", sql.Int, limit)
    .query(sqlString);
  };

  this.getOne = async function (id) {
    const pool = await conn;
    var sqlString = "SELECT * FROM dbo.school_year WHERE id = @id";
    return await pool.request().input("id", sql.VarChar, id).query(sqlString);
  };

  this.getByName = async function (name) {
    const pool = await conn;
    var sqlString = "SELECT * FROM dbo.school_year WHERE [name] = @name";
    return await pool
      .request()
      .input("name", sql.VarChar, name)
      .query(sqlString);
  };

  this.create = async function (name) {
    const pool = await conn;
    var sqlString = "INSERT INTO dbo.school_year (name) VALUES (@name)";
    return await pool
      .request()
      .input("name", sql.VarChar, name)
      .query(sqlString);
  };

  this.update = async function (newData) {
    const pool = await conn;
    var sqlString = "UPDATE dbo.school_year SET name = @name " + " WHERE id= @id";
    return await pool
      .request()
      .input("id", sql.Int, newData.id)
      .input("name", sql.VarChar, newData.name)
      .query(sqlString);
  };

  this.delete = async function (id) {
    const pool = await conn;
    var sqlString = "DELETE FROM dbo.school_year WHERE id = @id";
    return await pool.request().input("id", sql.Int, id).query(sqlString);
  };
};
