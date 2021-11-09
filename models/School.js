//connect DB
const { conn, sql } = require("../config/db");

module.exports = function(){
    this.getAll =  async function(result){
        const pool = await conn;
        var sqlString = "SELECT * FROM School";
        return await pool.request().query(sqlString);
      }

    this.getOne= async function(id, result){
        const pool = await conn;
        var sqlString = "SELECT * FROM School WHERE id = @id";
        return await pool
          .request()
          .input("id", sql.VarChar, id)
          .query(sqlString);
    }

    this.create= async function(newData, result) {
        const pool = await conn;
        var sqlString =
          "INSERT INTO dbo.School(id, address, description, name, type, createDay, updateDay) VALUES(@id, @address, @description, @name, @type, @createDay, @updateDay)";
        return await pool
          .request()
          .input("id", sql.VarChar, newData.id)
          .input("address", sql.NVarChar, newData.address)
          .input("description", sql.NVarChar, newData.decription)
          .input("name", sql.NVarChar, newData.name)
          .input("type", sql.VarChar, newData.type)
          .input("createDay", sql.DateTime, newData.createDay)
          .input("updateDay", sql.DateTime, newData.updateDay)
          .query(sqlString);
      };

      
    this.update= async function(newData, result) {
        const pool = await conn;
        var sqlString =
        "UPDATE dbo.School SET address = @address," +
        " description = @description, name = @name, type = @type, " +
        " createDay = @createDay, updateDay = @updateDay"
        " WHERE id= @id";
        return await pool
          .request()
          .input("id", sql.VarChar, newData.id)
          .input("address", sql.NVarChar, newData.address)
          .input("description", sql.NVarChar, newData.decription)
          .input("name", sql.NVarChar, newData.name)
          .input("type", sql.VarChar, newData.type)
          .input("createDay", sql.DateTime, newData.createDay)
          .input("updateDay", sql.DateTime, newData.updateDay)
          .query(sqlString);
      };

      this.delete= async function(id, result){
        const pool = await conn;
        var sqlString = "DELETE FROM School WHERE id = @id";
        return await pool
          .request()
          .input("id", sql.VarChar, id)
          .query(sqlString);
    }
}