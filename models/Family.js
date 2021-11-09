//connect DB
const { conn, sql } = require("../config/db");

module.exports = function(){
    this.getAll =  async function(result){
        const pool = await conn;
        var sqlString = "SELECT * FROM Family";
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
        var sqlString = "SELECT * FROM Family WHERE id = @id";
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
          "INSERT INTO dbo.Family(cmnd, name, relationShip, studentId) VALUES (@cmnd, @name, @relationShip, @studentId)";
        return await pool
          .request()
          .input("cmnd", sql.VarChar, newData.cmnd)
          .input("relationShip", sql.NVarChar, newData.relationShip)
          .input("studentId", sql.NVarChar, newData.studentId)
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
        "UPDATE dbo.Family SET name = @name, relationShip = @relationShip, studentId = @studentId" +
        " WHERE cmnd = @cmnd";
        console.log(sqlString);
        return await pool
          .request()
          .input("cmnd", sql.VarChar, newData.cmnd)
          .input("studentId", sql.VarChar, newData.studentId)
          .input("relationShip", sql.NVarChar, newData.relationShip)
          .input("name", sql.NVarChar, newData.name)
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
        var sqlString = "DELETE FROM Family WHERE cmnd = @cmnd";
        return await pool
          .request()
          .input("cmnd", sql.VarChar, cmnd)
          .query(sqlString, function (err, data) {
            if (err) {
                result(true, null);
              } else {
                result(null, "Delete family success");
              }
          });
    }
}