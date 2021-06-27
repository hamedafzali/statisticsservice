const { sp, sql } = require("../connection");
const express = require("express");
const router = express.Router();
const config = require("config");
var _ = require("lodash");
//const { request } = require("express");
const { username, password, host } = config.get("sql");
const sqlConfig = {
  user: username,
  password: password,
  server: host,
  database: "Statistics",
};

router.get("/getproducttitle/:id/", (req, res) => {
  sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool
        .request()
        .input("Id", sql.NVarChar(10), req.params.id)
        .execute("GetProductTitle");
    })
    .then((result) => {
      res.send(result.recordsets[0]);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get(
  "/getpersonsproduct/:managernationalcode/:paydate/:productid",
  (req, res) => {
    sql
      .connect(sqlConfig)
      .then((pool) => {
        return pool
          .request()
          .input("PayDate", sql.NVarChar(60), req.params.paydate)
          .input(
            "ManagerNationalCode",
            sql.NVarChar(100),
            req.params.managernationalcode
          )
          .input("ProductId", sql.Int, req.params.productid)
          .execute("GetPersonsProduct");
      })
      .then((result) => {
        res.send(result.recordsets[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }
);
router.get("/getproductpercent/:productid/", (req, res) => {
  sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool
        .request()
        .input("ProductId", sql.NVarChar(10), req.params.productid)
        .execute("GetProductPercent");
    })
    .then((result) => {
      res.send(result.recordsets[0]);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get(
  "/productinsert/:nationalcode/:a50/:a30/:a20/:paydate/:registrar/:productid",
  (req, res) => {
    sql
      .connect(sqlConfig)
      .then((pool) => {
        return pool
          .request()
          .input("PayDate", sql.NVarChar(6), req.params.paydate)
          .input("NationalCode", sql.NVarChar(10), req.params.nationalcode)
          .input("Registrar", sql.NVarChar(10), req.params.registrar)
          .input("A50", sql.Float, req.params.a50)
          .input("A30", sql.Float, req.params.a30)
          .input("A20", sql.Float, req.params.a20)
          .input("ProductId", sql.Float, req.params.productid)
          .execute("ProductInsert");
      })
      .then((result) => {
        res.send(result.recordsets[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }
);
router.get(
  "/getpersonsproductremain/:managernationalcode/:paydate/:producttypeid",
  (req, res) => {
    sql
      .connect(sqlConfig)
      .then((pool) => {
        // Stored procedure
        return pool
          .request()
          .input("PayDate", sql.NVarChar(60), req.params.paydate)
          .input("ProductTypeId", sql.Int, req.params.producttypeid)
          .input(
            "ManagerNationalCode",
            sql.NVarChar(10),
            req.params.managernationalcode
          )
          .execute("GetPersonsProductRemain");
      })
      .then((result) => {
        res.send(result.recordsets[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  }
);

router.get("/karanehstatus", (req, res) => {
  const result = sp([], "KaranehStatus");
  result.then((r) => res.send(r[0]));
});

router.get("/karanehpersonelreport/:code", (req, res) => {
  const result = sp(
    [{ Code: req.params.code, dataType: sql.NVarChar(10) }],
    "KaranehPersonelReport"
  );
  result.then((r) => res.send(r));
});

module.exports = router;
