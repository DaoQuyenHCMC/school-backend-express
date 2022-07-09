//connect DB
const { conn, sql } = require("../config/db");

module.exports = function () {
  const baseUrlPagination = "OFFSET (@offset-1)*@limit ROWS FETCH NEXT @limit ROWS ONLY ";
  this.getAllManager = async function ({ schoolId,
    offset,
    limit }) {
    const pool = await conn;
    var sqlString =
      "SELECT s.id, s.address, s.description, s.name, s.type, s.create_day createDay, s.update_day updateDay, s.create_by createBy, s.update_by updateBy FROM School s  "
    if (schoolId) {
      sqlString += "WHERE ";
      if (schoolId) {
        sqlString += "id = '" + schoolId + "' ";
      }
    }

    if (limit && offset) sqlString += baseUrlPagination;
    return await pool
      .request()
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getAllAdmin = async function ({ userId,
    offset,
    limit }) {
    const pool = await conn;
    var sqlString =
      "SELECT id, address, description, name, type, create_day createDay, update_day updateDay, create_by createBy, update_by updateBy FROM school " +
      "WHERE id = dbo.GetIdSchoolFromIdTeacher(@userId) ";
      if (limit && offset) sqlString += baseUrlPagination;
    return await pool
      .request()
      .input("userId", sql.VarChar, userId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getOne = async function (id) {
    const pool = await conn;
    var sqlString = "SELECT * FROM School WHERE id = @id";
    return await pool.request().input("id", sql.VarChar, id).query(sqlString);
  };

  this.create = async function (newData) {
    const pool = await conn;
    var sqlString =
      "INSERT INTO dbo.School(id, address, description, name, type, create_day, update_day, create_by, update_by) VALUES(@id,  N'" +
      newData.address +
      "', N'" +
      newData.decription +
      "', N'" +
      newData.name +
      "', @type, @create_day, @update_day, @create_by, @update_by)";
    return await pool
      .request()
      .input("id", sql.VarChar, newData.id)
      .input("type", sql.VarChar, newData.type)
      .input("create_day", sql.Date, Date.now())
      .input("update_day", sql.Date, Date.now())
      .input("create_by", sql.VarChar, newData.createBy)
      .input("update_by", sql.VarChar, newData.updateBy)
      .query(sqlString);
  };

  this.update = async function (newData) {
    const pool = await conn;
    var sqlString =
      "UPDATE dbo.School SET address =  N'" +
      newData.address +
      "'," +
      " description = N'" +
      newData.decription +
      "', name = N'" +
      newData.name +
      "', type = @type, update_day = @update_day, update_by = @update_by " +
      " WHERE id= @id";
    return await pool
      .request()
      .input("id", sql.VarChar, newData.id)
      .input("type", sql.VarChar, newData.type)
      .input("update_day", sql.Date, Date.now())
      .input("update_by", sql.VarChar, newData.updateBy)
      .query(sqlString);
  };

  this.delete = async function (id) {
    const pool = await conn;
    var sqlString = "DELETE FROM School WHERE id = @id";
    return await pool.request().input("id", sql.VarChar, id).query(sqlString);
  };

  this.getSchoolIdFromTeacher = async function ({ userId }) {
    const pool = await conn;
    var sqlString =
      "SELECT dbo.GetIdSchoolFromIdTeacher(@userId) schoolId";
    return await pool.request()
      .input("userId", sql.VarChar, userId)
      .query(sqlString);
  };

  this.getSchoolIdFromGrade = async function ({ gradeId }) {
    const pool = await conn;
    var sqlString =
      "SELECT dbo.GetIdSchoolFromIdGrade(@gradeId) schoolId";
    return await pool.request()
      .input("gradeId", sql.Int, gradeId)
      .query(sqlString);
  };

  this.getSchoolIdFromStudent = async function ({ studentId }) {
    const pool = await conn;
    var sqlString =
      "SELECT dbo.GetIdSchoolFromIdStudent(@studentId) schoolId";
    return await pool.request()
      .input("studentId", sql.VarChar, studentId)
      .query(sqlString);
  };


  this.getSchoolIdFromClass = async function ({ classId }) {
    const pool = await conn;
    var sqlString =
      "SELECT dbo.GetIdSchoolFromIdClass(@classId) schoolId";
    return await pool.request()
      .input("classId", sql.Int, classId)
      .query(sqlString);
  };

  this.getSchoolIdFromContactBook = async function ({ contactBook }) {
    const pool = await conn;
    var sqlString =
      "SELECT dbo.GetIdSchoolFromIdContactBook(@contactBook) schoolId";
    return await pool.request()
      .input("contactBook", sql.Int, contactBook)
      .query(sqlString);
  };

  this.getSchoolIdFromFee = async function ({ feeId }) {
    const pool = await conn;
    var sqlString =
      "SELECT dbo.GetIdSchoolFromIdFee(@feeId) schoolId";
    return await pool.request()
      .input("feeId", sql.Int, feeId)
      .query(sqlString);
  };
};
