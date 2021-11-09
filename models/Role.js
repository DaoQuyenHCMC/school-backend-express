//connect DB
const { conn, sql } = require("../config/db");

module.exports = function(){
    this.getAll =  async function(result){
        const pool = await conn;
        var sqlString = "SELECT * FROM Role";
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
        var sqlString = "SELECT * FROM Role WHERE id = @id";
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
          "INSERT INTO dbo.Role(id, name) VALUES(@id, @name)";
        console.log(sqlString);
        return await pool
          .request()
          .input("id", sql.VarChar, newData.id)
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
        "UPDATE dbo.Role SET name = @name," +
        " WHERE id= @id";
        console.log(sqlString);
        return await pool
          .request()
          .input("id", sql.VarChar, newData.id)
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
        var sqlString = "DELETE FROM Role WHERE id = @id";
        return await pool
          .request()
          .input("id", sql.VarChar, id)
          .query(sqlString, function (err, data) {
            if (err) {
                result(true, null);
              } else {
                result(null, "Delete role success");
              }
          });
    }
}