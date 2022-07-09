//connect DB
const { conn, sql } = require("../config/db");

module.exports = function () {

  const baseUrlStart = "SELECT  m.id, m.mark markStudentMark, cour.id courceId, cour.name courceName, subject_id subjectId, sb.[name] subjectName, cb.id contactBookId, cb.class_name className, cb.semester, cb.mark contactBookMark, s.id studentId, s.[name] studentName, t.id teacherId, t.[name] teacherName, y.id schoolYear, y.[name] yearName FROM mark_student m"
    + " LEFT JOIN dbo.contact_book cb ON m.contact_book_id = cb.id "
    + " LEFT JOIN dbo.cources cour ON m.cource_id = cour.id "
    + " LEFT JOIN dbo.subject sb ON cour.subject_id = sb.id "
    + " LEFT JOIN dbo.student s ON s.id = cb.student_id "
    + " LEFT JOIN dbo.teacher t ON cb.teacher_id = t.id "
    + " LEFT JOIN dbo.class c ON s.class_id = c.id "
    + " LEFT JOIN dbo.school_year y ON y.id = cb.school_year ";

  const baseUrlEndAdmin = "ORDER BY s.[name], t.id, s.id, cb.semester ";

  const baseUrlPagination = "OFFSET (@offset-1)*@limit ROWS FETCH NEXT @limit ROWS ONLY ";

  this.getAll = async function ({ contactBookId, studentId, schoolYear, markId, courceId, offset, limit }) {
    const pool = await conn;
    var sqlString = baseUrlStart;
    if (contactBookId || studentId || schoolYear || markId || courceId) {
      sqlString += "WHERE ";
      if (contactBookId) sqlString += " m.contact_book_id = @contactBookId ";
      if (sqlString.substring(sqlString.length - 6, sqlString.length - 1) !== "WHERE" && studentId) sqlString += "AND "
      if (studentId) sqlString += " cb.student_id = @studentId ";
      if (sqlString.substring(sqlString.length - 6, sqlString.length - 1) !== "WHERE" && schoolYear) sqlString += "AND "
      if (schoolYear) sqlString += " y.id = @schoolYear ";
      if (sqlString.substring(sqlString.length - 6, sqlString.length - 1) !== "WHERE" && markId) sqlString += "AND "
      if (markId) sqlString += " m.id = @markId ";
      if (sqlString.substring(sqlString.length - 6, sqlString.length - 1) !== "WHERE" && courceId) sqlString += "AND "
      if (courceId) sqlString += " cour.id = @courceId ";
    }
    sqlString += baseUrlEndAdmin;
    if(limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("contactBookId", sql.Int, contactBookId)
      .input("schoolYear", sql.Int, schoolYear)
      .input("markId", sql.Int, markId)
      .input("studentId", sql.VarChar, studentId)
      .input("courceId", sql.VarChar, courceId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  }

  this.getAllAdmin = async function ({ contactBookId, studentId, userId, schoolYear, markId, offset, limit }) {
    const pool = await conn;
    var sqlString = baseUrlStart
      + " WHERE t.school_id = dbo.GetIdSchoolFromIdTeacher(@userId) ";
    if (contactBookId) sqlString += "AND m.contact_book_id = @contactBookId ";
    if (studentId) sqlString += "AND cb.student_id = @studentId ";
    if (schoolYear) sqlString += "AND y.id = @schoolYear ";
    if (markId) sqlString += "AND m.id = @markId ";
    sqlString += baseUrlEndAdmin;
    if(limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("contactBookId", sql.Int, contactBookId)
      .input("schoolYear", sql.Int, schoolYear)
      .input("markId", sql.Int, markId)
      .input("studentId", sql.VarChar, studentId)
      .input("userId", sql.VarChar, userId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  }

  this.getAllTeacher = async function ({ contactBookId, studentId, userId, markId, schoolYear, semester, offset, limit, classId }) {
    const pool = await conn;
    var sqlString = baseUrlStart
      + " WHERE cour.teacher_id = @userId ";

    if (contactBookId) sqlString += "AND m.contact_book_id = @contactBookId ";
    if (studentId) sqlString += "AND cb.student_id = @studentId ";
    if (markId) sqlString += "AND m.id = @markId ";
    if (schoolYear) sqlString += "and cour.year_id = @yearId ";
    if (semester) sqlString += "and cour.semester = @semester ";
    if (classId) sqlString += "and c.id = @classId ";
    sqlString += " ORDER BY s.[name], t.id, s.id, sb.id, cb.id ";
    if(limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("contactBookId", sql.Int, contactBookId)
      .input("markId", sql.Int, markId)
      .input("studentId", sql.VarChar, studentId)
      .input("yearId", sql.Int, schoolYear)
      .input("semester", sql.VarChar, semester)
      .input("userId", sql.VarChar, userId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .input("classId", sql.Int, classId)
      .query(sqlString);
  }

  this.getAllTeacherClass = async function ({userId, yearId, semester}) {
    const pool = await conn;
    var sqlString = "SELECT  cour.id courceId, cour.name courceName, c.id class_id, cb.class_name className, y.id yearId, y.name yearName, cb.semester FROM mark_student m"
    + " INNER JOIN dbo.contact_book cb ON m.contact_book_id = cb.id "
    + " INNER JOIN dbo.cources cour ON m.cource_id = cour.id "
    + " INNER JOIN dbo.school_year y ON y.id = cb.school_year "
    + " LEFT JOIN dbo.student s ON s.id = cb.student_id "
    + " LEFT JOIN dbo.class c ON s.class_id = c.id "
    + " WHERE cour.teacher_id = @userId ";
    if(yearId) sqlString += "AND y.id = @yearId ";
    if(semester) sqlString += "AND cb.semester = @semester ";
    sqlString += " GROUP BY cour.id, cour.name, c.id , cb.class_name, y.id, y.name, cb.semester ";
    return await pool.request()
      .input("userId", sql.VarChar, userId)
      .input("yearId", sql.Int, yearId)
      .input("semester", sql.VarChar, semester)
      .query(sqlString);
  }


  this.getAllHomeRoomTeacher = async function ({ contactBookId, studentId, userId, markId, schoolYear, semester, offset, limit  }) {
    const pool = await conn;
    var sqlString = baseUrlStart + " WHERE cb.teacher_id = @userId ";
    if (contactBookId) sqlString += "AND m.contact_book_id = @contactBookId ";
    if (studentId) sqlString += "AND cb.student_id = @studentId ";
    if (markId) sqlString += "AND m.id = @markId ";
    if (schoolYear) sqlString += "and cour.year_id = @yearId ";
    if (semester) sqlString += "and cb.semester = @semester ";
    sqlString += " ORDER BY s.[name], t.id, s.id, sb.id, cb.id ";
    if(limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("contactBookId", sql.Int, contactBookId)
      .input("markId", sql.Int, markId)
      .input("studentId", sql.VarChar, studentId)
      .input("yearId", sql.Int, schoolYear)
      .input("semester", sql.VarChar, semester)
      .input("userId", sql.VarChar, userId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  }

  this.getAllStudent = async function ({ contactBookId, studentId, schoolYear, markId, semester, offset, limit  }) {
    const pool = await conn;
    var sqlString = baseUrlStart + " WHERE cb.student_id = @studentId ";
    if (contactBookId) sqlString += "AND m.contact_book_id = @contactBookId ";
    if (schoolYear) sqlString += "AND y.id = @schoolYear ";
    if (markId) sqlString += "AND m.id = @markId ";
    if (semester) sqlString += "and cb.semester = @semester ";
    sqlString += baseUrlEndAdmin;
    if(limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("contactBookId", sql.Int, contactBookId)
      .input("schoolYear", sql.Int, schoolYear)
      .input("markId", sql.Int, markId)
      .input("studentId", sql.VarChar, studentId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  }

  this.getYearStudent = async function ({ contactBookId, studentId, schoolYear, markId, offset, limit }) {
    const pool = await conn;
    var sqlString = "SELECT y.id schoolYear, y.[name] yearName FROM mark_student m"
      + " LEFT JOIN dbo.contact_book cb ON m.contact_book_id = cb.id "
      + " LEFT JOIN dbo.school_year y ON y.id = cb.school_year "
      + " WHERE cb.student_id = @studentId ";
    if (contactBookId) sqlString += "AND m.contact_book_id = @contactBookId ";
    if (schoolYear) sqlString += "AND y.id = @schoolYear ";
    if (markId) sqlString += "AND m.id = @markId ";
    sqlString += "group by y.id, y.[name] "
    sqlString += "ORDER BY y.id, y.name ";
    if(limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("contactBookId", sql.Int, contactBookId)
      .input("schoolYear", sql.Int, schoolYear)
      .input("markId", sql.Int, markId)
      .input("studentId", sql.VarChar, studentId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  }

  this.getMarkCourceStudent = async function ({ contactBookId, studentId, schoolYear, markId, offset, limit }) {
    const pool = await conn;
    var sqlString = baseUrlStart;
    // "LEFT JOIN dbo.cources cour ON cour.";
    if (contactBookId) sqlString += "AND m.contact_book_id = @contactBookId ";
    if (schoolYear) sqlString += "AND y.id = @schoolYear ";
    if (markId) sqlString += "AND m.id = @markId ";
    sqlString += "ORDER BY y.id, y.name ";
    if(limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("contactBookId", sql.Int, contactBookId)
      .input("schoolYear", sql.Int, schoolYear)
      .input("markId", sql.Int, markId)
      .input("studentId", sql.VarChar, studentId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  }

  this.getAllFamily = async function ({ contactBookId, familyId, schoolYear, markId, studentId, offset, limit }) {
    const pool = await conn;
    var sqlString = baseUrlStart
      + " LEFT JOIN dbo.family f ON s.cmnd_family = f.cmnd "
      + " WHERE f.cmnd = @familyId ";
    if (contactBookId) sqlString += "AND m.contact_book_id = @contactBookId ";
    if (schoolYear) sqlString += "AND y.id = @schoolYear ";
    if (markId) sqlString += "AND m.id = @markId ";
    if (studentId) sqlString += "AND s.id = @studentId ";
    sqlString += baseUrlEndAdmin;
    if(limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("contactBookId", sql.Int, contactBookId)
      .input("schoolYear", sql.Int, schoolYear)
      .input("markId", sql.Int, markId)
      .input("studentId", sql.VarChar, studentId)
      .input("familyId", sql.VarChar, familyId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  }

  this.getYearFamily = async function ({ contactBookId, studentId, schoolYear, markId, offset, limit }) {
    const pool = await conn;
    var sqlString = "SELECT y.id schoolYear, y.[name] yearName FROM mark_student m"
      + " LEFT JOIN dbo.contact_book cb ON m.contact_book_id = cb.id "
      + " LEFT JOIN dbo.school_year y ON y.id = cb.school_year "
      + " WHERE cb.student_id = @studentId ";
    if (contactBookId) sqlString += "AND m.contact_book_id = @contactBookId ";
    if (schoolYear) sqlString += "AND y.id = @schoolYear ";
    if (markId) sqlString += "AND m.id = @markId ";
    sqlString += "ORDER BY y.id, y.name ";
    if(limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("contactBookId", sql.Int, contactBookId)
      .input("schoolYear", sql.Int, schoolYear)
      .input("markId", sql.Int, markId)
      .input("studentId", sql.VarChar, studentId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  }


  this.checkExist = async function (contactBookId, courceId) {
    const pool = await conn;
    var sqlString = "SELECT 1 FROM mark_student "
      + " WHERE contact_book_id = @contactBookId AND cource_id = @courceId";
    return await pool
      .request()
      .input("contactBookId", sql.Int, contactBookId)
      .input("courceId", sql.Int, courceId)
      .query(sqlString);
  }

  this.getOne = async function (id) {
    const pool = await conn;
    var sqlString = "SELECT  m.id, m.mark markStudentMark, cour.id courceId, cour.name courceName, sb.id subjectId, sb.[name] subjectName, cb.id contactBookId, cb.class_name className, cb.semester, cb.mark contactBookMark, s.id studentId, s.[name] studentName, t.id teacherId, t.[name] teacherName, y.id schoolYear, y.[name] yearName FROM mark_student m"
      + " LEFT JOIN dbo.contact_book cb ON m.contact_book_id = cb.id "
      + " LEFT JOIN dbo.cources cour ON m.cource_id = cour.id "
      + " LEFT JOIN dbo.subject sb ON cour.subject_id = sb.id "
      + " LEFT JOIN dbo.student s ON s.id = cb.student_id "
      + " LEFT JOIN dbo.teacher t ON cb.teacher_id = t.id "
      + " LEFT JOIN dbo.school_year y ON y.id = cb.school_year WHERE m.id = @id";
    return await pool
      .request()
      .input("id", sql.Int, id)
      .query(sqlString);
  }

  this.create = async function (newData) {
    const pool = await conn;
    var sqlString =
      "INSERT INTO dbo.mark_student(contact_book_id, cource_id, mark) VALUES(@contactBookId, @courceId, @mark)";
    return await pool
      .request()
      .input("contactBookId", sql.Int, newData.contactBookId)
      .input("courceId", sql.Int, newData.courceId)
      .input("mark", sql.Float, newData.mark)
      .query(sqlString);
  };


  this.update = async function (newData) {
    const pool = await conn;
    var sqlString =
      "UPDATE dbo.mark_student SET " +
      " contact_book_id = @contactBookId, cource_id = @courceId, mark = @mark" +
      " WHERE id= @id";
    console.log(sqlString);
    return await pool
      .request()
      .input("id", sql.Int, newData.id)
      .input("contactBookId", sql.Int, newData.contactBookId)
      .input("courceId", sql.Int, newData.courceId)
      .input("mark", sql.Float, newData.mark)
      .query(sqlString);
  };

  this.delete = async function (id) {
    const pool = await conn;
    var sqlString = "DELETE FROM mark_student WHERE id = @id";
    return await pool
      .request()
      .input("id", sql.Int, id)
      .query(sqlString);
  }
}