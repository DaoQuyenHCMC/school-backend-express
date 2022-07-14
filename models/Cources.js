//connect DB
const { conn, sql } = require("../config/db");

module.exports = function () {

  const baseUrlStart = "SELECT c.id classId, c.[name] className, t.id teacherId, t.[name] teacherName, sc.[name] schoolName, t.school_id schoolId, g.id gradeId, g.[name] gradeName, " +
    "cour.id idCources, cour.[name] nameCources, year.id schoolYear, year.name yearName, cour.semester, sb.id subjectId FROM dbo.cources cour  " +
    "LEFT JOIN dbo.class c ON cour.class_id = c.id " +
    "LEFT JOIN dbo.teacher t ON cour.teacher_id = t.id " +
    "LEFT JOIN dbo.school sc ON cour.school_id = sc.id " +
    "LEFT JOIN dbo.grade g ON g.id = c.grade_id " +
    "LEFT JOIN dbo.subject sb ON sb.id = cour.subject_id " +
    "LEFT JOIN dbo.school_year year ON year.id = cour.year_id ";

  const baseUrlEndAdmin = "ORDER BY cour.school_id ASC, cour.id ASC, cour.name ASC "

  const baseUrlPagination = "OFFSET (@offset-1)*@limit ROWS FETCH NEXT @limit ROWS ONLY ";

  this.getAllManager = async function ({
    classId,
    teacherId,
    schoolId,
    gradeId,
    courceId,
    studentId,
    semester,
    yearId,
    offset,
    limit, 
    courseNameFind, 
    courseIdFind
  }) {
    const pool = await conn;
    var sqlString = baseUrlStart;

    if (classId || teacherId || schoolId || gradeId || courceId || studentId || semester || yearId || courseNameFind || courseIdFind) {
      if (studentId) {
        sqlString += "INNER JOIN dbo.student s ON s.class_id = c.id "
        sqlString += "WHERE s.id = @studentId ";
      } else {
        sqlString += "WHERE ";
      }
      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        classId
      ) {
        sqlString += "AND ";
      }
      if (classId) {
        sqlString += "c.id = @classId ";
      }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        teacherId
      ) {
        sqlString += "AND ";
      }

      if (teacherId) {
        sqlString += "cour.teacher_id = @teacherId ";
      }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        schoolId
      ) {
        sqlString += "AND ";
      }

      if (schoolId) {
        sqlString += "t.school_id = @schoolId ";
      }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        courceId
      ) {
        sqlString += "AND ";
      }

      if (courceId) {
        sqlString += "cour.id = @courceId ";
      }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        semester
      ) {
        sqlString += "AND ";
      }

      if (semester) {
        sqlString += "cour.semester = @semester ";
      }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        yearId
      ) {
        sqlString += "AND ";
      }

      if (yearId) {
        sqlString += "year.id = @yearId ";
      }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        courseIdFind
      ) {
        sqlString += "AND ";
      }

      if (courseIdFind) {
        if (courseIdFind) sqlString += " cour.[id] like '%" + courseIdFind +"%' ";
      }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        courseNameFind
      ) {
        sqlString += "AND ";
      }

      if (courseNameFind) {
        if (courseNameFind) sqlString += " cour.[name] like N'%" + courseNameFind +"%' ";
      }
    }

    sqlString += baseUrlEndAdmin;
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("classId", sql.Int, classId)
      .input("yearId", sql.Int, yearId)
      // .input("gradeId", sql.Int, gradeId)
      .input("schoolId", sql.VarChar, schoolId)
      .input("teacherId", sql.VarChar, teacherId)
      .input("courceId", sql.VarChar, courceId)
      .input("studentId", sql.VarChar, studentId)
      .input("semester", sql.VarChar, semester)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getCourceNameManager = async function ({
    classId,
    teacherId,
    schoolId,
    gradeId,
    courceId,
    studentId,
    semester,
    yearId,
    offset,
    limit
  }) {
    const pool = await conn;
    var sqlString = "SELECT cour.id courceId, cour.[name] courceName,  sc.[name] schoolName, t.school_id schoolId FROM dbo.cources cour " +
      "LEFT JOIN dbo.class c ON cour.class_id = c.id " +
      "LEFT JOIN dbo.teacher t ON cour.teacher_id = t.id " +
      "LEFT JOIN dbo.school sc ON cour.school_id = sc.id " +
      "LEFT JOIN dbo.grade g ON g.id = c.grade_id " +
      "LEFT JOIN dbo.school_year year ON year.id = cour.year_id ";

    if (classId || teacherId || schoolId || gradeId || courceId || studentId || semester || yearId) {
      if (studentId) {
        sqlString += "INNER JOIN dbo.student s ON s.class_id = c.id "
        sqlString += "WHERE s.id = @studentId ";
      } else {
        sqlString += "WHERE ";
      }
      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        classId
      ) {
        sqlString += "AND ";
      }

      if (classId) {
        sqlString += "c.id = @classId ";
      }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        teacherId
      ) {
        sqlString += "AND ";
      }

      if (teacherId) {
        sqlString += "cour.teacher_id = @teacherId ";
      }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        schoolId
      ) {
        sqlString += "AND ";
      }

      if (schoolId) {
        sqlString += "t.school_id = @schoolId ";
      }

      // if (
      //   sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
      //   "WHERE" &&
      //   gradeId
      // ) {
      //   sqlString += "AND ";
      // }

      // if (gradeId) {
      //   sqlString += "c.grade_id = @gradeId ";
      // }

      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        courceId
      ) {
        sqlString += "AND ";
      }

      if (courceId) {
        sqlString += "cour.id = @courceId ";
      }
      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        semester
      ) {
        sqlString += "AND ";
      }

      if (semester) {
        sqlString += "cour.semester = @semester ";
      }
      if (
        sqlString.substring(sqlString.length - 6, sqlString.length - 1) !==
        "WHERE" &&
        yearId
      ) {
        sqlString += "AND ";
      }

      if (yearId) {
        sqlString += "year.id = @yearId ";
      }
    }
    sqlString += baseUrlEndAdmin;
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("classId", sql.Int, classId)
      .input("yearId", sql.Int, yearId)
      .input("schoolId", sql.VarChar, schoolId)
      .input("teacherId", sql.VarChar, teacherId)
      .input("courceId", sql.VarChar, courceId)
      .input("studentId", sql.VarChar, studentId)
      .input("semester", sql.VarChar, semester)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getAllAdmin = async function ({
    classId,
    teacherId,
    userId,
    courceId,
    studentId,
    semester,
    yearId,
    offset,
    limit,
    courseNameFind,
    courseIdFind
  }) {
    const pool = await conn;
    var sqlString = baseUrlStart;
    if (studentId) {
      sqlString += "INNER JOIN dbo.student s ON s.class_id = c.id "
      sqlString += "WHERE s.id = @studentId AND ";
    } else {
      sqlString += "WHERE ";
    }
    sqlString += " sc.id = dbo.GetIdSchoolFromIdTeacher(@userId) ";
    if (classId) sqlString += "AND c.id = @classId ";
    if (teacherId) sqlString += "AND c.teacher_id = @teacherId ";
    if (semester) sqlString += "AND cour.semester = @semester ";
    // if (gradeId) sqlString += "AND c.grade_id = @gradeId ";
    if (courceId) sqlString += "AND cour.id = @courceId ";
    if (yearId) sqlString += "AND year.id = @yearId ";
    if (courseNameFind) sqlString += "AND cour.[name] like N'%" + courseNameFind +"%' ";
    if (courseIdFind) sqlString += "AND cour.[id] like '%" + courseIdFind +"%' ";
    sqlString += baseUrlEndAdmin;
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("classId", sql.Int, classId)
      .input("teacherId", sql.VarChar, teacherId)
      .input("courceId", sql.VarChar, courceId)
      .input("userId", sql.VarChar, userId)
      .input("studentId", sql.VarChar, studentId)
      .input("semester", sql.VarChar, semester)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getCourceNameAdmin = async function ({
    classId,
    teacherId,
    userId,
    courceId,
    studentId,
    semester,
    yearId,
    offset,
    limit
  }) {
    const pool = await conn;
    var sqlString = "SELECT cour.id courceId, cour.[name] courceName,  sc.[name] schoolName, t.school_id schoolId FROM dbo.cources cour " +
      "LEFT JOIN dbo.class c ON cour.class_id = c.id " +
      "LEFT JOIN dbo.teacher t ON cour.teacher_id = t.id " +
      "LEFT JOIN dbo.school sc ON cour.school_id = sc.id " +
      "LEFT JOIN dbo.grade g ON g.id = c.grade_id " +
      "LEFT JOIN dbo.school_year year ON year.id = cour.year_id ";
    if (studentId) {
      sqlString += "INNER JOIN dbo.student s ON s.class_id = c.id "
      sqlString += "WHERE s.id = @studentId AND ";
    } else {
      sqlString += "WHERE ";
    }
    sqlString += " sc.id = dbo.GetIdSchoolFromIdTeacher(@userId) ";
    if (classId) sqlString += "AND c.id = @classId ";
    if (teacherId) sqlString += "AND c.teacher_id = @teacherId ";
    if (semester) sqlString += "AND cour.semester = @semester ";
    // if (gradeId) sqlString += "AND c.grade_id = @gradeId ";
    if (courceId) sqlString += "AND cour.id = @courceId ";
    if (yearId) sqlString += "AND year.id = @yearId ";
    sqlString += baseUrlEndAdmin;
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("classId", sql.Int, classId)
      .input("teacherId", sql.VarChar, teacherId)
      .input("courceId", sql.VarChar, courceId)
      .input("userId", sql.VarChar, userId)
      .input("studentId", sql.VarChar, studentId)
      .input("semester", sql.VarChar, semester)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.checkDuplicateData = async function ({
    classId,
    yearId,
    schoolId,
    subjectId,
    semester,
    courceId
  }) {
    const pool = await conn;
    var sqlString = "Select 1 from dbo.cources c ";
    sqlString += "WHERE c.class_id = @classId " +
      "AND c.school_id = @schoolId " +
      "AND c.year_id = @yearId " +
      "AND c.semester = @semester " +
      "AND c.subject_id = @subjectId ";
    if (courceId) sqlString += "AND c.id != @courceId ";
    return await pool.request()
      .input("courceId", sql.Int, courceId)
      .input("classId", sql.Int, classId)
      .input("subjectId", sql.Int, subjectId)
      .input("schoolId", sql.VarChar, schoolId)
      .input("yearId", sql.Int, yearId)
      .input("semester", sql.VarChar, semester)
      .query(sqlString);
  };

  this.getAllTeacher = async function ({
    teacherId,
    classId,
    courceId,
    limit,
    offset, 
    courseNameFind, 
    courseIdFind 
  }) {
    const pool = await conn;
    var sqlString = baseUrlStart;
    sqlString += "WHERE cour.teacher_id = @teacherId ";
    if (classId) sqlString += "AND c.id = @classId ";
    if (courceId) sqlString += "AND cour.id = @courceId ";
    if (courseNameFind) sqlString += "AND cour.[name] like N'%" + courseNameFind +"%' ";
    if (courseIdFind) sqlString += "AND cour.[id] like '%" + courseIdFind +"%' ";
    sqlString += baseUrlEndAdmin;
    if (limit && offset) sqlString += baseUrlPagination;
    return await pool.request()
      .input("teacherId", sql.VarChar, teacherId)
      .input("classId", sql.Int, classId)
      .input("courceId", sql.VarChar, courceId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(sqlString);
  };

  this.getAllTeacherNameCourse = async function ({
    teacherId }) {
    const pool = await conn;
    var sqlString = "SELECT c.name className, c.id classId FROM dbo.cources cour  " +
    "LEFT JOIN dbo.class c ON cour.class_id = c.id " +
    "WHERE cour.teacher_id = @teacherId " +
    "GROUP BY c.name, c.id "
    return await pool.request()
      .input("teacherId", sql.VarChar, teacherId)
      .query(sqlString);
  };


  this.create = async function (newData) {
    const pool = await conn;
    var sqlString =
      "INSERT INTO dbo.cources(name, class_id, teacher_id, subject_id, year_id, school_id, semester) VALUES( N'" +
      newData.name +
      "', @classId, @teacherId, @subjectId, @yearId, @schoolId, @semester)";
    return await pool
      .request()
      .input("name", sql.NVarChar, newData.name)
      .input("classId", sql.Int, newData.classId)
      .input("schoolId", sql.VarChar, newData.schoolId)
      .input("teacherId", sql.VarChar, newData.teacherId)
      .input("subjectId", sql.Int, newData.subjectId)
      .input("yearId", sql.Int, newData.yearId)
      .input("semester", sql.VarChar, newData.semester)
      .query(sqlString);
  };

  this.update = async function (newData) {
    const pool = await conn;
    var sqlString =
      "UPDATE dbo.cources SET name =  N'" +
      newData.name +
      "', class_id = @classId, teacher_id = @teacherId, " +
      "school_id = @schoolId, subject_id = @subjectId, year_id = @yearId  " +
      " WHERE id= @id";
    return await pool
      .request()
      .input("id", sql.VarChar, newData.id)
      .input("name", sql.NVarChar, newData.name)
      .input("classId", sql.Int, newData.classId)
      .input("schoolId", sql.VarChar, newData.schoolId)
      .input("teacherId", sql.VarChar, newData.teacherId)
      .input("subjectId", sql.Int, newData.subjectId)
      .input("yearId", sql.Int, newData.yearId)
      .query(sqlString);
  };

  this.delete = async function (id) {
    const pool = await conn;
    var sqlString = "DELETE FROM dbo.cources WHERE id = @id";
    return await pool.request().input("id", sql.VarChar, id).query(sqlString);
  };
};
