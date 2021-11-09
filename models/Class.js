//connect DB
const { conn, sql } = require("../config/db");

module.exports = function(){
    this.getAll =  async function(result){
        const pool = await conn;
        var sqlString = "SELECT * FROM Class";
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
        var sqlString = "SELECT * FROM Class WHERE id = @id";
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
          "INSERT INTO dbo.Class(id, gradeId, teacherId, name, total) VALUES(@id, @gradeId, @teacherId, @name, @total)";
        return await pool
          .request()
          .input("id", sql.VarChar, newData.id)
          .input("gradeId", sql.NVarChar, newData.gradeId)
          .input("teacherId", sql.NVarChar, newData.teacherId)
          .input("total", sql.NVarChar, newData.total)
          .input("name", sql.NVarChar, newData.name)
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
        "UPDATE dbo.Class SET  gradeId = @gradeId, teacherId = @teacherId, name = @name, total = @total" +
        " WHERE id= @id";
        console.log(sqlString);
        return await pool
          .request()
          .input("id", sql.VarChar, newData.id)
          .input("gradeId", sql.NVarChar, newData.gradeId)
          .input("teacherId", sql.NVarChar, newData.teacherId)
          .input("total", sql.NVarChar, newData.total)
          .input("name", sql.NVarChar, newData.name)
          .query(sqlString, function (err, data) {
            if (err) {
                result(true, null);
              } else {
                result(null, newData);
              }
          });
      };

      this.delete= async function(id, result){
        const pool = await conn;
        var sqlString = "DELETE FROM Class WHERE id = @id";
        return await pool
          .request()
          .input("id", sql.VarChar, id)
          .query(sqlString, function (err, data) {
            if (err) {
                result(true, null);
              } else {
                result(null, "Delete class success");
              }
          });
    }
}