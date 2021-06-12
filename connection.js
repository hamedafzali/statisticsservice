const sql = require("mssql");
const config = require("config");
const { username, password, host } = config.get("sql");
const sqlConfig = {
  user: username,
  password: password,
  server: host, // You can use 'localhost\\instance' to connect to named instance
  database: "Statistics",
  options: {
    encrypt: true,
    enableArithAbort: true,
    requestTimeout: 500,
    connectionTimeout: 15000,
  },
};

function sp(params, sp) {
  return sql
    .connect(sqlConfig)
    .then((pool) => {
      const requestPool = pool.request();
      params.map((i) => {
        requestPool.input(Object.keys(i)[0], i.dataType, i[Object.keys(i)[0]]);
      });
      return requestPool.execute(sp);
    })
    .then((result) => {
      return result.recordsets[0];
    })
    .catch((err) => {
      console.error(err);
    });
}
module.exports = { sp, sql };
