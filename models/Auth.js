//connect DB
const { conn, sql } = require("../config/db");

module.exports = function(){
    this.loginTeacher =  async function(username){
        const pool = await conn;
        var sqlString = "SELECT [password], r.id roleId, r.name roleName, t.name, sc.name schoolName, sc.id schoolId FROM dbo.teacher t " + 
        "LEFT JOIN dbo.[school] sc ON sc.id = t.school_id " + 
        "INNER JOIN dbo.[role] r ON t.role_id = r.id Where t.id = @id";
        return await pool
        .request()
        .input("id", sql.VarChar, username)
        .query(sqlString);
    }

    this.loginStudent =  async function(username){
        const pool = await conn;
        var sqlString = "SELECT [password], r.id roleId, r.name roleName, s.name, sc.name schoolName, sc.id schoolId FROM dbo.student s " + 
        "LEFT JOIN dbo.[school] sc ON sc.id = s.school_id " + 
        "INNER JOIN dbo.[role] r ON s.role_id = r.id WHERE s.id = @id";
        return await pool
        .request()
        .input("id", sql.VarChar, username)
        .query(sqlString);
    }

    this.loginFamily =  async function(username){
        const pool = await conn;
        var sqlString = "SELECT [password], r.id roleId, r.name roleName, f.name FROM dbo.family f INNER JOIN dbo.[role] r ON f.role_id = r.id WHERE f.cmnd = @cmnd";
        return await pool
        .request()
        .input("cmnd", sql.VarChar, username)
        .query(sqlString);
    }

    this.getForEmailStudent =  async function(username){
        const pool = await conn;
        var sqlString = "SELECT email FROM dbo.student WHERE id = @id";
        return await pool
        .request()
        .input("id", sql.VarChar, username)
        .query(sqlString);
    }

    this.getForEmailTeacher =  async function(username){
        const pool = await conn;
        var sqlString = "SELECT email FROM dbo.teacher WHERE id = @id";
        return await pool
        .request()
        .input("id", sql.VarChar, username)
        .query(sqlString);
    }

    this.getForEmailFamily =  async function(username){
        const pool = await conn;
        var sqlString = "SELECT email FROM dbo.family WHERE cmnd = @id";
        return await pool
        .request()
        .input("id", sql.VarChar, username)
        .query(sqlString);
    }
    

    this.updatePassswordStudent =  async function(username, password){
        const pool = await conn;
        var sqlString =  "UPDATE dbo.student SET password = @password WHERE id= @id";
        return await pool
        .request()
        .input("id", sql.VarChar, username)
        .input("password", sql.VarChar, password)
        .query(sqlString);
    }

    this.updatePassswordFamily =  async function(username, password){
        const pool = await conn;
        var sqlString =  "UPDATE dbo.family SET password = @password WHERE cmnd= @cmnd";
        return await pool
        .request()
        .input("cmnd", sql.VarChar, username)
        .input("password", sql.VarChar, password)
        .query(sqlString);
    }

    this.updatePassswordTeacher =  async function(username, password){
        const pool = await conn;
        var sqlString =  "UPDATE dbo.teacher SET password = @password WHERE id= @id";
        return await pool.request()
        .input("id", sql.VarChar, username)
        .input("password", sql.VarChar, password)
        .query(sqlString);
    }

    this.updatePassswordFamily =  async function(username, password){
        const pool = await conn;
        var sqlString =  "UPDATE dbo.family SET password = @password WHERE cmnd= @id";
        return await pool.request()
        .input("id", sql.VarChar, username)
        .input("password", sql.VarChar, password)
        .query(sqlString);
    }


    this.checkLoginAdmin = async function (id, roleId) {
        const pool = await conn;
        var sqlString = "SELECT 1 FROM dbo.Teacher t " +
        "INNER JOIN dbo.[Role] r ON t.role_id = r.id WHERE t.id = @id AND t.role_id = @roleId ";
        return await pool.request()
        .input("id", sql.VarChar, id)
        .input("roleId", sql.VarChar, roleId)
        .query(sqlString);
      };

      this.checkRoleAdminManager = async function (userId, roleId) {
        const pool = await conn;
        var sqlString = "SELECT 1 FROM dbo.Teacher t " +
        "INNER JOIN dbo.[Role] r ON t.role_id = r.id " +
        "WHERE t.id = @userId AND r.id = @roleId";
        return await pool.request()
        .input("userId", sql.VarChar, userId)
        .input("roleId", sql.VarChar, roleId)
        .query(sqlString);
      };

      
      this.checkRoleFamily = async function (userId) {
        const pool = await conn;
        var sqlString = "SELECT 1 FROM dbo.Family f WHERE f.cmnd = @userId ";
        return await pool.request()
        .input("userId", sql.VarChar, userId)
        .query(sqlString);
      };
}