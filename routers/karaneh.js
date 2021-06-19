const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const config = require("config");
var _ = require("lodash");
const { sp, sql } = require("../connection");
const { username, password, host } = config.get("sql");
const sqlConfig = {
  user: username,
  password: password,
  server: host, // You can use 'localhost\\instance' to connect to named instance
  database: "Statistics",
};
router.get("/karanehdata/:ratio/:diff/:paydate", (req, res) => {
  sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool
        .request()
        .input("Ratio", sql.Float, req.params.ratio)
        .input("Diff", sql.Float, req.params.diff)
        .input("PayDate", sql.NVarChar(10), req.params.paydate)
        .execute("GetKaranehData");
    })
    .then((result) => {
      res.send(result.recordsets[0][0]);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/karanehdata1/:ratio/:diff/:paydate/:val", (req, res) => {
  sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool
        .request()
        .input("Ratio", sql.Float, req.params.ratio)
        .input("Diff", sql.Float, req.params.diff)
        .input("PayDate", sql.NVarChar(10), req.params.paydate)
        .input("Val", sql.NVarChar(50), req.params.val)
        .execute("GetKaranehData1");
    })
    .then((result) => {
      res.send(result.recordsets[0][0]);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/getsupervisors/", (req, res) => {
  sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool.request().execute("GetSupervisors");
    })
    .then((result) => {
      res.send(result.recordsets[0]);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/getkaranehdates/", (req, res) => {
  sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool.request().execute("GetKaranehDates");
    })
    .then((result) => {
      res.send(result.recordsets[0]);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/getsupervisorsrank/:ratio/:paydate", (req, res) => {
  sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool
        .request()
        .input("Ratio", sql.Float, req.params.ratio)
        .input("PayDate", sql.NVarChar(6), req.params.paydate)
        .execute("GetSupervisorsRank");
    })
    .then((result) => {
      res.send(result.recordsets[0]);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/getbranchesrank/:ratio/:paydate", (req, res) => {
  sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool
        .request()
        .input("Ratio", sql.Float, req.params.ratio)
        .input("PayDate", sql.NVarChar(6), req.params.paydate)
        .execute("GetBranchesRank");
    })
    .then((result) => {
      res.send(result.recordsets[0]);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/getkarnameho/:paydate", (req, res) => {
  sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool
        .request()
        .input("PayDate", sql.NVarChar(6), req.params.paydate)
        .execute("GetKarnamehO");
    })
    .then((result) => {
      res.send(result.recordsets[0]);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/getkarnamehsh/:paydate", (req, res) => {
  sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool
        .request()
        .input("PayDate", sql.NVarChar(6), req.params.paydate)
        .execute("GetKarnamehSH");
    })
    .then((result) => {
      res.send(result.recordsets[0]);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/getaddition/:paydate", (req, res) => {
  sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool
        .request()
        .input("PayDate", sql.NVarChar(6), req.params.paydate)
        .execute("GetAddition");
    })
    .then((result) => {
      res.send(result.recordsets[0]);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get(
  "/setkaranehparams/:paydate/:min/:max/:ratio/:setadhour/:safhour",
  (req, res) => {
    sql
      .connect(sqlConfig)
      .then((pool) => {
        return (
          pool
            .request()
            .input("PayDate", sql.NVarChar(6), req.params.paydate)
            .input("min", sql.Int, req.params.min)
            .input("max", sql.Int, req.params.max)
            .input("Ratio", sql.Float, req.params.ratio)
            .input("SetadHour", sql.Float, req.params.setadhour)
            .input("SafHour", sql.Float, req.params.safhour)
            //.output('output_parameter', sql.VarChar(50))
            .execute("SetKaranehParams")
        );
      })
      .then((result) => {
        res.send(result.recordsets[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }
);
router.get("/getpersonskaraneh/:managernationalcode/:paydate/", (req, res) => {
  sql
    .connect(sqlConfig)
    .then((pool) => {
      // Stored procedure
      return pool
        .request()
        .input("PayDate", sql.NVarChar(60), req.params.paydate)
        .input(
          "ManagerNationalCode",
          sql.NVarChar(100),
          req.params.managernationalcode
        )
        .execute("GetPersonsKaraneh");
    })
    .then((result) => {
      res.send(result.recordsets[0]);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get(
  "/getpersonelkaraneh/:paydate/:ratiosaf/:ratiosetad/:ratio",
  (req, res) => {
    sql
      .connect(sqlConfig)
      .then((pool) => {
        return pool
          .request()
          .input("PayDate", sql.NVarChar(6), req.params.paydate)
          .input("RatioSaf", sql.Float, req.params.ratiosaf)
          .input("RatioSetad", sql.Float, req.params.ratiosetad)
          .input("Ratio", sql.Float, req.params.ratio)
          .execute("GetPersonelKaraneh");
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
  "/karanehinsert/:nationalcode/:a50/:a30/:a20/:paydate/:registrar",
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
          .execute("KaranehInsert");
      })
      .then((result) => {
        res.send(result.recordsets[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }
);
router.get("/getpersonskaranehremain/:nationalcode/:paydate", (req, res) => {
  sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool
        .request()
        .input("PayDate", sql.NVarChar(6), req.params.paydate)
        .input("ManagerNationalCode", sql.NVarChar(10), req.params.nationalcode)
        .execute("GetPersonsKaranehRemain");
    })
    .then((result) => {
      res.send(result.recordsets[0]);
    })
    .catch((err) => {
      // ... error checks
      console.log(err);
    });
});
router.get(
  "/managerskaranehinsert/:nationalcode/:paydate/:amount",
  (req, res) => {
    sql
      .connect(sqlConfig)
      .then((pool) => {
        return pool
          .request()
          .input("PayDate", sql.NVarChar(6), req.params.paydate)
          .input("Amount", sql.Int, req.params.amount)
          .input("NationalCode", sql.NVarChar(10), req.params.nationalcode)
          .execute("ManagersKaranehInsert");
      })
      .then((result) => {
        res.send(result.recordsets[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }
);
router.get("/karanehaccesslist/:type", (req, res) => {
  sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool
        .request()
        .input("type", sql.NVarChar(10), req.params.type)
        .execute("KaranehAccessList");
    })
    .then((result) => {
      res.send(result.recordsets[0]);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/karanehaccessupdate/:id", (req, res) => {
  sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool
        .request()
        .input("BranchCode", sql.NVarChar(10), req.params.id)
        .execute("KaranehAccessUpdate");
    })
    .then((result) => {
      res.send(result.recordsets[0]);
    })
    .catch((err) => {
      console.error(err);
    });
});
router.get("/karanehaccessupdateall/:type/:status", (req, res) => {
  sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool
        .request()
        .input("Type", sql.NVarChar(10), req.params.type)
        .input("Status", sql.Int, req.params.status)
        .execute("KaranehAccessUpdateAll");
    })
    .then((result) => {
      res.send(result.recordsets[0]);
    })
    .catch((err) => {
      console.error(err);
    });
});
router.get("/getkarnamehpersontotal/:paydate", (req, res) => {
  const result = sp(
    [{ Paydate: req.params.paydate, dataType: sql.NVarChar(10) }],
    "GetKarnamehPersonTotal"
  );
  result.then((r) => res.send(r));
});
router.get("/getkarnamehbranchtotal/:paydate", (req, res) => {
  const result = sp(
    [{ Paydate: req.params.paydate, dataType: sql.NVarChar(10) }],
    "GetKarnamehBranchTotal"
  );
  result.then((r) => res.send(r));
});
router.get("/getkarnamehsupervisortotal/:paydate", (req, res) => {
  const result = sp(
    [{ Paydate: req.params.paydate, dataType: sql.NVarChar(10) }],
    "GetKarnamehSupervisorTotal"
  );
  result.then((r) => res.send(r));
});
module.exports = router;
