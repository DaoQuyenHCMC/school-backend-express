//connect DB
const { conn, sql } = require("../config/db");

module.exports = function(){
  const baseUrlPagination = "OFFSET (@offset-1)*@limit ROWS FETCH NEXT @limit ROWS ONLY ";
    this.getAll =  async function({offset, limit}){
        const pool = await conn;
        var sqlString = "SELECT * FROM Subject ORDER BY name ";
        if(limit && offset) sqlString += baseUrlPagination;
        return await pool.request()
        .input("offset", sql.Int, offset)
        .input("limit", sql.Int, limit)
        .query(sqlString);
      }

      this.getNameById =  async function(id){
        const pool = await conn;
        var sqlString = "SELECT name FROM Subject where id = @id";
        return await pool.request()
        .input("id", sql.Int, id)
        .query(sqlString);
      }

    this.getOne= async function(id){
        const pool = await conn;
        var sqlString = "SELECT * FROM Subject WHERE id = @id";
        return await pool
          .request()
          .input("id", sql.Int, id)
          .query(sqlString);
    }

    this.create= async function(newData) {
        const pool = await conn;
        var sqlString =
          "INSERT INTO dbo.Subject(name) VALUES(N'"+ newData.name +"')";
        return await pool
          .request()
          .query(sqlString);
      };

      
    this.update= async function(newData) {
        const pool = await conn;
        var sqlString =
        "UPDATE dbo.Subject SET " +
        " name = N'"+ newData.name +"' WHERE id= @id";
        console.log(sqlString);
        return await pool
          .request()
          .input("id", sql.Int, newData.id)
          .query(sqlString);
      };

      this.delete= async function(id){
        const pool = await conn;
        var sqlString = "DELETE FROM Subject WHERE id = @id";
        return await pool
          .request()
          .input("id", sql.Int, id)
          .query(sqlString);
    }
}