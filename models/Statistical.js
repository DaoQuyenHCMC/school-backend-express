//connect DB
const { conn, sql } = require("../config/db");

module.exports = function () {
    this.getAllManager = async function ({semester, yearId}) {
        const pool = await conn;
        var sqlString = "SELECT dbo.GetTotalStudentCurrentYear() sumStudentManagerCurrentYear, " + 
        "dbo.GetTotalStudentLastYear() sumStudentManagerLastYear, " +     
        "dbo.GetTotalStudent() sumStudentManager, " ;
    
        if(semester && yearId){
            sqlString += "dbo.GetTotalFeeInSemesterYear(@semester, @yearId) sumFeeInSemesterYear, "+
            "dbo.GetMaxAVGInYearSemester( @yearId, @semester) maxAVGInYearSemester,";
           
        } else if(yearId){
            sqlString +=  "dbo.GetTotalFeeInYear(@yearId) sumFeeInYear, " +
            "dbo.GetMaxAVGInYear(@yearId) maxAVGInYear, ";
        }
        sqlString += "dbo.GetTotalClass() sumClassManager ";
        return await pool.request()
        .input("semester", sql.VarChar, semester)
        .input("yearId", sql.Int, yearId)
        .query(sqlString);
    }

    this.getAllManagerMark = async function ({semester, yearId}) {
        const pool = await conn;
        var sqlString = "select t.school_id schoolId, c.class_name, AVG(c.mark) MarkAVG " +
        "from dbo.contact_book c " +
        "inner join dbo.teacher t on t.id = c.teacher_id " +
        "inner join dbo.school s on s.id = t.school_id ";
        if(semester && yearId){
            sqlString += "where c.school_year = @yearId and c.semester = @semester ";
        }else if(yearId){
            sqlString += "where c.school_year = @yearId ";
        }
        sqlString += "group by c.class_name, t.school_id " + "order by t.school_id ";
        return await pool.request()
        .input("semester", sql.VarChar, semester)
        .input("yearId", sql.Int, yearId)
        .query(sqlString);
    }

    this.getAllAdminMark = async function ({userId, semester, yearId}) {
        const pool = await conn;
        var sqlString = "select t.school_id schoolId, c.class_name, AVG(c.mark) MarkAVG " +
        "from dbo.contact_book c " +
        "inner join dbo.teacher t on t.id = c.teacher_id " +
        "inner join dbo.school s on s.id = t.school_id " +
        "where  s.id = dbo.GetIdSchoolFromIdTeacher(@userId) ";
        if(semester && yearId){
            sqlString += " and c.school_year = @yearId and c.semester = @semester ";
        }else if(yearId){
            sqlString += " and c.school_year = @yearId ";
        }
        sqlString += "group by c.class_name, t.school_id " + "order by t.school_id ";
        return await pool.request()
        .input("userId", sql.VarChar, userId)
        .input("semester", sql.VarChar, semester)
        .input("yearId", sql.Int, yearId)
        .query(sqlString);
    }

    this.getAllAdmin = async function ({userId, semester, yearId}) {
        const pool = await conn;
        var sqlString = "SELECT dbo.GetTotalStudentFromTeacherId(@userId) sumStudentAdmin, " +
        "dbo.GetTotalClassFromTeacherId(@userId) sumClassAdmin, " + 
        "dbo.GetTotalStudentFromTeacherIdCurrentYear(@userId) sumStudentAdminCurrentYear, ";
        if(semester && yearId){
            sqlString += "dbo.GetTotalFeeInSemesterYearAdmin(@semester, @yearId, @userId) sumFeeInSemesterYearAdmin, "+
            "dbo.GetMaxAVGInYearAdminSemester( @yearId, @userId, @semester) maxAVGInYearSemester, "
        } else if(yearId){
            sqlString +=   "dbo.GetTotalFeeInYearAdmin(@yearId, @userId) sumFeeInYearAdmin, "+
            "dbo.GetMaxAVGInYearAdmin(@yearId, @userId) maxAVGInYear, ";
        }
        sqlString += "dbo.GetTotalStudentFromTeacherIdLastYear(@userId) sumStudentAdminLastYear " ;
        return await pool.request()
        .input("userId", sql.VarChar, userId)
        .input("semester", sql.VarChar, semester)
        .input("yearId", sql.Int, yearId)
        .query(sqlString);
    }
}