//connect DB
const { conn, sql } = require("../config/db");

module.exports = function(){
    this.getAll =  async function(result){
        const pool = await conn;
        var sqlString = "SELECT * FROM Fee";
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
        var sqlString = "SELECT * FROM Fee WHERE id = @id";
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
          "INSERT INTO dbo.Fee(id, studentId, semesterId, dateFee, tuitionFee) VALUES(@id, @studentId, @semesterId, @dateFee, @tuitionFee)";
        return await pool
          .request()
          .input("id", sql.VarChar, newData.id)
          .input("studentId", sql.VarChar, newData.studentId)
          .input("semesterId", sql.VarChar, newData.semesterId)
          .input("dateFee", sql.DateTime,  Date.now())
          .input("tuitionFee", sql.Money, newData.tuitionFee)
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
        "UPDATE dbo.Fee SET studentId = @studentId, semesterId = @semesterId, dateFee = @dateFee, tuitionFee = @tuitionFee" +
        " WHERE id= @id";
        console.log(sqlString);
        return await pool
          .request()
          .input("id", sql.VarChar, newData.id)
          .input("studentId", sql.VarChar, newData.studentId)
          .input("semesterId", sql.VarChar, newData.semesterId)
          .input("dateFee", sql.DateTime,  Date.now())
          .input("tuitionFee", sql.Money, newData.tuitionFee)
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
        var sqlString = "DELETE FROM Fee WHERE id = @id";
        return await pool
          .request()
          .input("id", sql.VarChar, id)
          .query(sqlString, function (err, data) {
            if (err) {
                result(true, null);
              } else {
                result(null, "Delete fee success");
              }
          });
    }
}