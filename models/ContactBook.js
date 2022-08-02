//connect DB
const { conn, sql } = require("../config/db");

module.exports = function () {
  const baseUrlStart = "SELECT cb.id, cb.class_name className, cb.semester, cb.mark, s.id studentId, s.[name] studentName, t.id teacherId, t.[name] teacherName, y.id schoolYear, y.[name] yearName, f.cmnd cmndFamily, f.[name] nameFamily FROM dbo.contact_book cb " +
    "LEFT JOIN dbo.student s ON s.id = cb.student_id " +
    "LEFT JOIN dbo.teacher t ON cb.teacher_id = t.id " +
    "LEFT JOIN dbo.school_year y ON y.id = cb.school_year " +
    "LEFT JOIN dbo.family f ON f.cmnd = s.cmnd_family ";

  const baseUrlEndAdmin = "ORDER BY s.school_id, y.name, cb.class_name, cb.semester, s.[name], s.id "

  const baseUrlPagination = "OFFSET (@offset-1)*@limit ROWS FETCH NEXT @limit ROWS ONLY ";

  this.getAll = async function ({
    studentId,
    teacherId,
    schoolYear,
    studentName,
    semester,
    offset,
    limit,
    cmndFamily,
    contactBookId, 
    classNameFind, 
    studentNameFind, 
    studentIdFind, 
    yearNameFind
  }) {
    const pool = await conn;
    var sqlString = baseUrlStart;
    if (studentId || teacherId || schoolYear || studentName || semester || cmndFamily || contactBookId 
      || (classNameFind && classNameFind !== 'undefined') 
      || (studentNameFind && studentNameFind !== 'undefined')
      || (studentIdFind && studentIdFind !== 'undefined') 
      || (yearNameFind && yearNameFind !== 'undefined')) {
      sqlString += "WHERE ";
      if (studentId) sqlString += " cb.student_id = @studentId ";
      if (sqlString.substring(sqlString.length - 6, sqlString.length - 1) !== "WHERE" && teacherId) sqlString += "AND ";
      if (teacherId) sqlString += " cb.teacher_id = @teacherId ";
      if (sqlString.substring(sqlString.length - 6, sqlString.length - 1) !== "WHERE" && schoolYear) sqlString += "AND ";
      if (schoolYear) sqlString += " cb.school_year = @schoolYear ";
      if (sqlString.substring(sqlString.length - 6, sqlString.length - 1) !== "WHERE" && studentName) sqlString += "AND ";
      if (studentName) sqlString += " s.[name] = N'" + studentName + "' ";
      if (sqlString.substring(sqlString.length - 6, sqlString.length - 1) !== "WHERE" && semester) sqlString += "AND ";
      if (semester) sqlString += " cb.semester = @semester ";
      if (sqlString.substring(sqlString.length - 6, sqlString.length - 1) !== "WHERE" && cmndFamily) sqlString += "AND ";
      if (cmndFamily) sqlString += " f.cmnd = @cmndFamily ";
      if (sqlString.substring(sqlString.length - 6, sqlString.length - 1) !== "WHERE" && contactBookId) sqlString += "AND ";
      if (contactBookId) sqlString += " cb.id = @contactBookId ";
      if (sqlString.substring(sqlString.length - 6, sqlString.length - 1) !== "WHERE" && classNameFind && classNameFind != 'undefined') sqlString += "AND ";
      if (classNameFind && classNameFind != 'undefined') sqlString += " cb.class_name like N'%" + classNameFind + "%' ";
      if (sqlString.substring(sqlString.length - 6, sqlString.length - 1) !== "WHERE" && studentNameFind && studentNameFind != 'undefined') sqlString += "AND ";
      if (studentNameFind && studentNameFind != 'undefined') sqlString += " s.[name] like N'%" + studentNameFind + "%' ";
      if (sqlString.substring(sqlString.length - 6, sqlString.length - 1) !== "WHERE" && studentIdFind && studentIdFind != 'undefined') sqlString += "AND ";
      if (studentIdFind && studentIdFind != 'undefined') sqlString += " s.[id] like '%" + studentIdFind + "%' ";
      if (sqlString.substring(sqlString.length - 6, sqlString.length - 1) !== "WHERE" && yearNameFind && yearNameFind != 'undefined') sqlString += "AND ";
      if (yearNameFind && yearNameFind != 'undefined') sqlString += " y.[name] like '%" + yearNameFind + "%' ";
    }
    sqlString += baseUrlEndAdmin;
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("semester", sql.VarChar, semester)
      .input("teacherId", sql.VarChar, teacherId)
      .input("studentId", sql.VarChar, studentId)
      .input("cmndFamily", sql.VarChar, cmndFamily)
      .input("schoolYear", sql.Int, schoolYear)
      .input("contactBookId", sql.Int, contactBookId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getAllAdmin = async function ({
    studentId,
    teacherId,
    schoolYear,
    studentName,
    userId,
    contactBookId,
    semester,
    limit,
    offset, 
    classNameFind, 
    studentNameFind, 
    studentIdFind, 
    yearNameFind
  }) {
    const pool = await conn;
    var sqlString = baseUrlStart + "WHERE t.school_id = dbo.GetIdSchoolFromIdTeacher(@userId) ";
    if (studentId) sqlString += "AND cb.student_id = @studentId ";
    if (teacherId) sqlString += "AND cb.teacher_id = @teacherId ";
    if (schoolYear) sqlString += "AND cb.school_year = @schoolYear ";
    if (studentName) sqlString += "AND s.[name] = N'" + studentName + "' ";
    if (contactBookId) sqlString += "AND cb.id = @contactBookId ";
    if (semester) sqlString += "AND cb.semester = @semester ";
    if (studentNameFind && studentNameFind != 'undefined') sqlString += "AND s.[name] like N'%" + studentNameFind + "%' ";
    if (studentIdFind && studentIdFind != 'undefined') sqlString += "AND s.[id] like '%" + studentIdFind + "%' ";
    if (yearNameFind && yearNameFind != 'undefined') sqlString += "AND y.[name] like '%" + yearNameFind + "%' ";
    if (classNameFind && classNameFind != 'undefined') sqlString += "AND cb.class_name like N'%" + classNameFind + "%' ";
    sqlString += baseUrlEndAdmin;
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("userId", sql.VarChar, userId)
      .input("teacherId", sql.VarChar, teacherId)
      .input("contactBookId", sql.VarChar, contactBookId)
      .input("studentId", sql.VarChar, studentId)
      .input("schoolYear", sql.Int, schoolYear)
      .input("semester", sql.VarChar, semester)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getOne = async function (id) {
    const pool = await conn;
    var sqlString =
      "SELECT cb.id, cb.class_name className, cb.semester, cb.mark, s.id studentId, s.[name] studentName, t.id teacherId, t.[name] teacherName, y.id schoolYear, y.[name] yearName FROM dbo.contact_book cb " +
      "LEFT JOIN dbo.student s ON s.id = cb.student_id " +
      "LEFT JOIN dbo.teacher t ON cb.teacher_id = t.id " +
      "LEFT JOIN dbo.school_year y ON y.id = cb.school_year WHERE cb.id = @id";
    return await pool.request().input("id", sql.Int, id).query(sqlString);
  };

  this.getByYearSemesterGrade = async function (
    schoolYear,
    semester,
    gradeId
  ) {
    const pool = await conn;
    var sqlString =
      "SELECT cb.id FROM dbo.contact_book cb " +
      "LEFT JOIN dbo.student s ON s.id = cb.student_id " +
      "LEFT JOIN dbo.school_year y ON y.id = cb.school_year " +
      "LEFT JOIN dbo.class c ON s.class_id = c.id " +
      "LEFT JOIN dbo.grade g ON g.id = c.grade_id " +
      " WHERE cb.semester = @semester AND cb.school_year = @schoolYear AND g.id = @gradeId";
    return await pool
      .request()
      .input("gradeId", sql.Int, gradeId)
      .input("semester", sql.VarChar, semester)
      .input("schoolYear", sql.Int, schoolYear)
      .query(sqlString);
  };

  this.checkExisted = async function (newData) {
    const pool = await conn;
    var sqlString =
      "SELECT 1 FROM dbo.Contact_book " +
      "WHERE student_id = @studentId AND semester = @semester AND class_name = N'" +
      newData.className +
      "' AND school_year = @schoolYear";
    return await pool
      .request()
      .input("studentId", sql.VarChar, newData.studentId)
      .input("semester", sql.VarChar, newData.semester)
      .input("schoolYear", sql.Int, newData.schoolYear)
      .query(sqlString);
  };

  this.updateMark = async function (id) {
    const pool = await conn;
    var sqlString =
      "update dbo.Contact_book " +
      "set mark = ISNULL(dbo.ComputeMark(@id), 0)  " +
      "where id = @id ";

    return await pool.request().input("id", sql.Int, id).query(sqlString);
  };

  this.create = async function (newData) {
    const pool = await conn;
    var sqlString =
      "INSERT INTO dbo.Contact_book(student_id, teacher_id, semester, mark, class_name, school_year) VALUES (@studentId, @teacherId, @semester, @mark, N'" +
      newData.className +
      "', @schoolYear)";
    return await pool
      .request()
      .input("studentId", sql.VarChar, newData.studentId)
      .input("teacherId", sql.VarChar, newData.teacherId)
      .input("semester", sql.VarChar, newData.semester)
      .input("mark", sql.Float, newData.mark)
      .input("schoolYear", sql.Int, newData.schoolYear)
      .query(sqlString);
  };

  this.update = async function (newData) {
    const pool = await conn;
    var sqlString =
      "UPDATE dbo.Contact_book SET semester = @semester, student_id = @studentId, mark = @mark, class_name = N'" +
      newData.className +
      "', teacher_id = @teacherId, school_year = @schoolYear " +
      " WHERE id= @id";
    return await pool
      .request()
      .input("id", sql.Int, newData.id)
      .input("studentId", sql.VarChar, newData.studentId)
      .input("teacherId", sql.VarChar, newData.teacherId)
      .input("semester", sql.VarChar, newData.semester)
      .input("mark", sql.Float, newData.mark)
      .input("schoolYear", sql.Int, newData.schoolYear)
      .query(sqlString);
  };

  this.delete = async function (id) {
    const pool = await conn;
    var sqlString = "DELETE FROM contact_book WHERE id = @id";
    return await pool.request().input("id", sql.Int, id).query(sqlString);
  };
};
