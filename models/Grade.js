//connect DB
const { conn, sql } = require("../config/db");

module.exports = function(){
    this.getAll =  async function(){
        const pool = await conn;
        var sqlString = "SELECT * FROM Grade";
        return await pool.request().query(sqlString);
      }

    this.getOne= async function(id){
        const pool = await conn;
        var sqlString = "SELECT * FROM Grade WHERE id = @id";
        return await pool
          .request()
          .input("id", sql.VarChar, id)
          .query(sqlString);
    }

    this.create= async function(newData) {
        const pool = await conn;
        var sqlString =
          "INSERT INTO dbo.Grade(schoolId, name) VALUES(@schoolId, @name)";
        return await pool
          .request()
          .input("schoolId", sql.NVarChar, newData.address)
          .input("name", sql.Int, newData.name)
          .query(sqlString);
      };

      
    this.update= async function(newData) {
        const pool = await conn;
        var sqlString =
        "UPDATE dbo.Grade SET schoolId = @schoolId," +
        " name = @name " +
        " WHERE id= @id";
        console.log(sqlString);
        return await pool
          .request()
          .input("id", sql.Int, newData.id)
          .input("schoolId", sql.VarChar, newData.schoolId)
          .input("name", sql.Int, newData.name)
          .query(sqlString);
      };

      this.delete= async function(id){
        const pool = await conn;
        var sqlString = "DELETE FROM Grade WHERE id = @id";
        return await pool
          .request()
          .input("id", sql.Int, id)
          .query(sqlString);
    }
}