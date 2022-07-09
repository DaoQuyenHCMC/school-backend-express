//connect DB
const { conn, sql } = require("../config/db");

module.exports = function(){
    this.getAll =  async function(){
        const pool = await conn;
        var sqlString = "SELECT * FROM Role";
        return await pool.request().query(sqlString);
      }

    this.getOne= async function(id){
        const pool = await conn;
        var sqlString = "SELECT * FROM Role WHERE id = @id";
        return await pool
          .request()
          .input("id", sql.VarChar, id)
          .query(sqlString);
    }
}