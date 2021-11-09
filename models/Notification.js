//connect DB
const { conn, sql } = require("../config/db");

module.exports = function(){
    this.getAll =  async function(){
        const pool = await conn;
        var sqlString = "SELECT * FROM Notification";
        return await pool.request().query(sqlString);
      }

    this.getOne= async function(id){
        const pool = await conn;
        var sqlString = "SELECT * FROM Notification WHERE id = @id";
        return await pool
          .request()
          .input("id", sql.Int, id)
          .query(sqlString);
    }

    this.getByExtracurricularActivitiesId= async function(id){
      const pool = await conn;
      var sqlString = "SELECT * FROM Notification WHERE extracurricularActivitiesId = @extracurricularActivitiesId";
      return await pool
        .request()
        .input("extracurricularActivitiesId", sql.Int, id)
        .query(sqlString);
  }

    this.create= async function(newData) {
        const pool = await conn;
        var sqlString =
          "INSERT INTO dbo.Notification(title, description, extracurricularActivitiesId, createDay, updateDay) VALUES(@title, @description, @extracurricularActivitiesId, @createDay, @updateDay)";
        return await pool
          .request()
          .input("extracurricularActivitiesId", sql.Int, newData.extracurricularActivitiesId)
          .input("title", sql.NVarChar, newData.title)
          .input("description", sql.NVarChar, newData.description)
          .input("createDay", sql.DateTime, newData.createDay)
          .input("updateDay", sql.DateTime, newData.updateDay)
          .query(sqlString);
      };

      
    this.update= async function(newData) {
        const pool = await conn;
        var sqlString =
        "UPDATE dbo.Notification SET title = @title, description = @description, extracurricularActivitiesId = @extracurricularActivitiesId, updateDay = @updateDay " +
        " WHERE id= @id";
        console.log(sqlString);
        return await pool
          .request()
          .input("extracurricularActivitiesId", sql.Int, newData.extracurricularActivitiesId)
          .input("id", sql.VarChar, newData.id)
          .input("title", sql.NVarChar, newData.title)
          .input("description", sql.NVarChar, newData.description)
          .input("updateDay", sql.DateTime, Date.now())
          .query(sqlString);
      };

      this.delete= async function(id){
        const pool = await conn;
        var sqlString = "DELETE FROM Notification WHERE id = @id";
        return await pool
          .request()
          .input("id", sql.VarChar, id)
          .query(sqlString);
    }

    this.checkExisted= async function(id){
      const pool = await conn;
      var sqlString = "SELECT 1 FROM Notification WHERE id = @id";
      return await pool
        .request()
        .input("id", sql.Int, id)
        .query(sqlString);
  }
}