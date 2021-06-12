const { sp, sql } = require("../connection");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const config = require("config");

router.get("/checkuser/:username/:password", (req, res) => {
  const { username, password, host } = config.get("sql");
  const sqlConfig = {
    user: username,
    password: password,
    server: host,
    database: "Statistics",
    options: {
      encrypt: true,
      enableArithAbort: true,
    },
  };

  sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool
        .request()
        .input("NationalCode", sql.NVarChar(10), req.params.username)
        .input("Password", sql.NVarChar(100), req.params.password)
        .execute("CheckUser");
    })
    .then((result) => {
      const token = jwt.sign(result.recordset[0], config.get("jwtPrivateKey"));
      res
        .header("x-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token");
      res.send(result);
    })
    .catch((err) => {
      const token = jwt.sign("invalid user", config.get("jwtPrivateKey"));
      res
        .header("x-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token");
      res.send("invalid user");
      console.log(err);
    });
});
router.get("/getmenu/:groupid", (req, res) => {
  const result = sp(
    [{ groupid: req.params.groupid, dataType: sql.NVarChar(10) }],
    "GetMenuData"
  );
  result.then((r) => res.send(r));
});

router.get("/accesscontrol/:groupid/:link", (req, res) => {
  const result = sp(
    [
      { GroupId: req.params.groupid, dataType: sql.Int },
      { Link: req.params.link, dataType: sql.NVarChar(10) },
    ],
    "CheckAccessControl"
  );
  result.then((r) => res.send(r));
});

// router.get(
//   "/changepassword/:nationalcode/:oldpassword/:newpassword",
//   (req, res) => {
//     const result = sp(
//       [
//         { NationalCode: req.params.nationalcode, dataType: sql.NVarChar(10) },
//         { OldPassword: req.params.oldpassword, dataType: sql.NVarChar(100) },
//         { NewPassword: req.params.newpassword, dataType: sql.NVarChar(100) },
//       ],
//       "ChangePassword"
//     );
//     result.then((r) => res.send(r));
//   }
// );

router.post("/changepassword", (req, res) => {
  const result = sp(
    [
      { NationalCode: req.body.nationalcode, dataType: sql.NVarChar(10) },
      { OldPassword: req.body.oldpassword, dataType: sql.NVarChar(100) },
      { NewPassword: req.body.newpassword, dataType: sql.NVarChar(100) },
    ],
    "ChangePassword"
  );
  result.then((r) => res.send(r));
});

// router.get("/resetpassword/:nationalcode/:newpassword", (req, res) => {
//   const { username, password, host } = config.get("sql");
//   const sqlConfig = {
//     user: username,
//     password: password,
//     server: host,
//     database: "Statistics",
//   };
//   const sql = require("mssql");
//   sql
//     .connect(sqlConfig)
//     .then((pool) => {
//       console.log(req.params.username);
//       return pool
//         .request()
//         .input("NationalCode", sql.NVarChar(10), req.params.nationalcode)
//         .input("NewPassword", sql.NVarChar(100), req.params.newpassword)
//         .execute("ResetPassword");
//     })
//     .then((result) => {
//       res.send(result.recordsets[0]);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });
router.post("/resetpassword", (req, res) => {
  const result = sp(
    [
      { NationalCode: req.body.nationalcode, dataType: sql.NVarChar(10) },
      { NewPassword: req.body.newpassword, dataType: sql.NVarChar(100) },
    ],
    "ResetPassword"
  );
  result.then((r) => res.send(r));
});
router.get("/karanehaccress/:nationalcode/:karanehaccesstype", (req, res) => {
  //console.log(req.header["x-auth-token"]);
  const { username, password, host } = config.get("sql");
  const sqlConfig = {
    user: username,
    password: password,
    server: host, // You can use 'localhost\\instance' to connect to named instance
    database: "Statistics",
  };
  const sql = require("mssql");
  sql
    .connect(sqlConfig)
    .then((pool) => {
      console.log(req.params.username);
      return pool
        .request()
        .input("NationalCode", sql.NVarChar(10), req.params.nationalcode)
        .input("KaranehAccessTypeId", sql.Int, req.params.karanehaccesstype)
        .execute("CheckKaranehAccess");
    })
    .then((result) => {
      res.send(result.recordsets[0]);
    })
    .catch((err) => {
      console.log(err);
    });
});
module.exports = router;
