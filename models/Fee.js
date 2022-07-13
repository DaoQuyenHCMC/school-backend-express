//connect DB
const { conn, sql } = require("../config/db");

module.exports = function () {
  const baseUrlPagination = "OFFSET (@offset-1)*@limit ROWS FETCH NEXT @limit ROWS ONLY ";

  this.getAll = async function ({
    contactBookId,
    studentId,
    offset,
    limit,
    feeId,
    cmndFamily,
    status
  }) {
    const pool = await conn;
    var sqlString = "SELECT f.id, f.contact_book_id contactBookId, f.tuition_fee tuitionFee, f.status, f.date_fee dateFee, ct.student_id studentId, ct.teacher_id teacherId, ct.school_year schoolYear, ct.semester, ct.class_name className, y.name year FROM dbo.fee f "
      + " LEFT JOIN dbo.contact_book ct ON ct.id = f.contact_book_id "
      + " LEFT JOIN dbo.student s ON s.id = ct.student_id "
      + " LEFT JOIN dbo.family fa ON fa.cmnd = s.cmnd_family "
      + " LEFT JOIN dbo.school_year y ON ct.school_year = y.id ";
    if (contactBookId || studentId || feeId || cmndFamily || status) {
      sqlString += "WHERE ";
      if (contactBookId) sqlString += " f.contact_book_id = @contactBookId ";
      if (sqlString.substring(sqlString.length - 6, sqlString.length - 1) !== "WHERE" && studentId) sqlString += "AND ";
      if (studentId) sqlString += " ct.student_id = @studentId ";
      if (sqlString.substring(sqlString.length - 6, sqlString.length - 1) !== "WHERE" && feeId) sqlString += "AND ";
      if (feeId) sqlString += " f.id = @feeId ";
      if (sqlString.substring(sqlString.length - 6, sqlString.length - 1) !== "WHERE" && cmndFamily) sqlString += "AND ";
      if (cmndFamily) sqlString += " fa.cmnd = @cmndFamily ";
      if (sqlString.substring(sqlString.length - 6, sqlString.length - 1) !== "WHERE" && status) sqlString += "AND ";
      if (status) sqlString += " f.status = @status ";
    }
    sqlString += " ORDER BY y.name, ct.class_name, f.date_fee ";
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .input("feeId", sql.Int, feeId)
      .input("contactBookId", sql.Int, contactBookId)
      .input("studentId", sql.VarChar, studentId)
      .input("cmndFamily", sql.VarChar, cmndFamily)
      .input("status", sql.Bit, Number(status))
      .query(sqlString);
  }

  this.getAllAdmin = async function ({ contactBookId, studentId, feeId, userId, offset, limit }) {
    const pool = await conn;
    var sqlString = "SELECT f.id, f.contact_book_id contactBookId, f.tuition_fee tuitionFee, f.status, f.date_fee dateFee, ct.student_id studentId, ct.teacher_id teacherId, ct.school_year schoolYear, ct.semester, ct.class_name className, y.name year FROM dbo.fee f "
      + " LEFT JOIN dbo.contact_book ct ON ct.id = f.contact_book_id "
      + " LEFT JOIN dbo.school_year y ON ct.school_year = y.id "
      + "LEFT  JOIN dbo.teacher t ON ct.teacher_id = t.id "
      + " WHERE t.school_id = dbo.GetIdSchoolFromIdTeacher(@userId) ";
    if (contactBookId || studentId || feeId) {
      if (contactBookId) {
        sqlString += "AND f.contact_book_id = @contactBookId ";
      }

      if (studentId) {
        sqlString += "AND ct.student_id = @studentId ";
      }

      if (feeId) {
        sqlString += "AND f.id = @feeId ";
      }
    }
    sqlString += " ORDER BY y.name, ct.class_name, f.date_fee ";
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("feeId", sql.Int, feeId)
      .input("contactBookId", sql.Int, contactBookId)
      .input("studentId", sql.VarChar, studentId)
      .input("userId", sql.VarChar, userId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  }

  this.getOne = async function (id) {
    const pool = await conn;
    var sqlString = "SELECT f.id, f.contact_book_id contactBookId, f.tuition_fee tuitionFee, f.status, f.date_fee dateFee, ct.student_id studentId, ct.teacher_id teacherId, ct.school_year schoolYear, ct.semester, ct.class_name className, y.name year FROM dbo.fee f "
      + " LEFT JOIN dbo.contact_book ct ON ct.id = f.contact_book_id "
      + " LEFT JOIN dbo.school_year y ON ct.school_year = y.id WHERE f.id = @id";
    return await pool
      .request()
      .input("id", sql.VarChar, id)
      .query(sqlString);
  }

  this.create = async function (newData) {
    const pool = await conn;
    var sqlString =
      "INSERT INTO dbo.Fee(contact_book_id, date_fee, tuition_fee, status) VALUES(@contactBookId, @dateFee, @tuitionFee, @status)";
    return await pool
      .request()
      .input("contactBookId", sql.Int, newData.contactBookId)
      .input("dateFee", sql.Date, newData.dateFee)
      .input("tuitionFee", sql.Money, newData.tuitionFee)
      .input("status", sql.Bit, 0)
      .query(sqlString);
  };


  this.update = async function (newData) {
    const pool = await conn;
    var sqlString =
      "UPDATE dbo.Fee SET contact_book_id = @contactBookId, date_fee = @dateFee, tuition_fee = @tuitionFee, status = @status" +
      " WHERE id= @id";
    return await pool
      .request()
      .input("id", sql.Int, newData.id)
      .input("contactBookId", sql.Int, newData.contactBookId)
      .input("dateFee", sql.Date, newData.dateFee)
      .input("tuitionFee", sql.Money, newData.tuitionFee)
      .input("status", sql.Bit, newData.status)
      .query(sqlString);
  };

  this.delete = async function (id) {
    const pool = await conn;
    var sqlString = "DELETE FROM Fee WHERE id = @id";
    return await pool
      .request()
      .input("id", sql.Int, id)
      .query(sqlString);
  }
}