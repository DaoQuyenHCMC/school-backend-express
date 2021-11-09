//connect DB
const { conn, sql } = require("../config/db");

module.exports = function(){
    this.getAll =  async function(result){
        const pool = await conn;
        var sqlString = "SELECT * FROM ContactBook";
        return await pool.request().query(sqlString, function (err, data) {
          if (data.recordset.length > 0) {
                result(null, data.recordset);
              } else {
                result(true, null);
              }
        });
      }

    this.getOne= async function(id, result){
        const pool = await conn;
        var sqlString = "SELECT * FROM ContactBook WHERE id = @id";
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
    }

    this.create= async function(newData, result) {
        const pool = await conn;
        var sqlString =
          "INSERT INTO dbo.ContactBook(id, semesterId, subjectId, studentId, mark) VALUES (@id, @semesterId, @subjectId, @studentId, @mark)";
        return await pool
          .request()
          .input("id", sql.VarChar, newData.id)
          .input("semesterId", sql.NVarChar, newData.semesterId)
          .input("subjectId", sql.NVarChar, newData.subjectId)
          .input("studentId", sql.VarChar, newData.studentId)
          .input("mark", sql.Float, newData.mark)
          .query(sqlString, function (err, data) {
            if (err) {
                result(true, null);
              } else {
                result(null, newData);
              }
          });
      };

      
    this.update= async function(newData, result) {
        const pool = await conn;
        var sqlString =
        "UPDATE dbo.ContactBook SET semesterId = @semesterId, subjectId = @subjectId, studentId = @studentId, mark = @mark" +
        " WHERE id= @id";
        console.log(sqlString);
        return await pool
          .request()
          .input("id", sql.VarChar, newData.id)
          .input("semesterId", sql.NVarChar, newData.semesterId)
          .input("subjectId", sql.NVarChar, newData.subjectId)
          .input("studentId", sql.VarChar, newData.studentId)
          .input("mark", sql.Float, newData.mark)
          .query(sqlString, function (err, data) {
            if (err) {
                result(true, null);
              } else {
                result(null, newData);
              }
          });
      };

      this.delete= async function(cmnd, result){
        const pool = await conn;
        var sqlString = "DELETE FROM ContactBook WHERE id = @id";
        return await pool
          .request()
          .input("id", sql.VarChar, id)
          .query(sqlString, function (err, data) {
            if (err) {
                result(true, null);
              } else {
                result(null, "Delete contact book success");
              }
          });
    }
}