var sql = require("mssql/msnodesqlv8");

const config = {
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true,
  },
};

const conn = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    return pool;
  });

module.exports = {
  conn: conn,
  sql: sql,
};
