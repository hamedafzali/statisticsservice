const { sp, sql } = require("../connection");
const express = require("express");
const router = express.Router();
const config = require("config");
var _ = require("lodash");
const { username, password, host } = config.get("sql");
const sqlConfig = {
  user: username,
  password: password,
  server: host, // You can use 'localhost\\instance' to connect to named instance
  database: "Statistics",
};

router.get("/chartperson/:id/", (req, res) => {
  sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool
        .request()
        .input("Id", sql.NVarChar(10), req.params.id)
        .execute("getChartPersons");
    })
    .then((result) => {
      res.send(JSON.stringify(transformToTree(result.recordsets[0]), null, 2));
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/chart/:id/", (req, res) => {
  sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool
        .request()
        .input("Id", sql.NVarChar(10), req.params.id)
        .execute("getChart");
    })
    .then((result) => {
      res.send(JSON.stringify(transformToTree(result.recordsets[0]), null, 2));
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/chartupdate", (req, res) => {
  const result = sp(
    [
      { NationalCode: req.body.nationalCode, dataType: sql.NVarChar(10) },
      { SourceId: req.body.sourceId, dataType: sql.NVarChar(100) },
      { Description: req.body.Description, dataType: sql.NVarChar(100) },
      {
        DestinationCode: req.body.destinationCode,
        dataType: sql.NVarChar(100),
      },
      {
        DestinationName: req.body.destinationName,
        dataType: sql.NVarChar(100),
      },
      { DestinationId: req.body.destinationId, dataType: sql.NVarChar(100) },
      { Tel: req.body.tel, dataType: sql.NVarChar(100) },
      { PayDate: req.body.paydate, dataType: sql.NVarChar(100) },
      { Registrar: req.body.Registrar, dataType: sql.NVarChar(100) },
    ],
    "ChangePassword"
  );
  result.then((r) => res.send(r));
});
router.get(
  "/chartupdate/:nationalcode/:sourceid/:description/:destinationcode/:destinationname/:destinationid/:tel/:paydate/:registrar",
  (req, res) => {
    sql
      .connect(sqlConfig)
      .then((pool) => {
        return pool
          .request()
          .input("NationalCode", sql.NVarChar(50), req.params.nationalcode)
          .input("SourceId", sql.Int, req.params.sourceid)
          .input("Description", sql.NVarChar(4000), req.params.description)
          .input(
            "DestinationCode",
            sql.NVarChar(50),
            req.params.destinationcode
          )
          .input(
            "DestinationName",
            sql.NVarChar(500),
            req.params.destinationname
          )
          .input("DestinationId", sql.Int, req.params.destinationid)
          .input("Tel", sql.NVarChar(50), req.params.tel)
          .input("PayDate", sql.NVarChar(60), req.params.paydate)
          .input("Registrar", sql.NVarChar(50), req.params.registrar)
          .execute("RelocateRequestInsert");
      })
      .then((result) => {
        res.send(result.recordsets[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }
);
function transformToTree(arr) {
  var nodes = {};
  return arr.filter((obj) => {
    var id = obj["key"],
      parentId = obj["PId"];
    nodes[id] = _.defaults(obj, nodes[id], { nodes: [] });
    parentId &&
      (nodes[parentId] = nodes[parentId] || { nodes: [] })["nodes"].push(obj);

    return !parentId;
  });
}
router.get("/getrelocaterequest/:paydate/:nationalcode", (req, res) => {
  sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool
        .request()
        .input("PayDate", sql.NVarChar(6), req.params.paydate)
        .input("NationalCode", sql.NVarChar(10), req.params.nationalcode)
        .execute("RelocateRequestGetallData");
    })
    .then((result) => {
      res.send(result.recordsets[0]);
    })
    .catch((err) => {
      // ... error checks
      console.log(err);
    });
  //res.send(users);
});
router.get("/commitrelocaterequest/:id/:nationalcode", (req, res) => {
  sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool
        .request()
        .input("Id", sql.Int, req.params.id)
        .input("NationalCode", sql.NVarChar(50), req.params.nationalcode)
        .execute("CommitRelocateRequest");
    })
    .then((result) => {
      res.send(result.recordsets[0]);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get(
  "/personlocationsetstatus/:nationalcode/:description/:sourceid/:registrar/:paydate",
  (req, res) => {
    sql
      .connect(sqlConfig)
      .then((pool) => {
        return pool
          .request()
          .input("NationalCode", sql.NVarChar(10), req.params.nationalcode)
          .input("Description", sql.NVarChar(500), req.params.description)
          .input("sourceid", sql.Int, req.params.sourceid)
          .input("registrar", sql.NVarChar(10), req.params.registrar)
          .input("Paydate", sql.NVarChar(6), req.params.paydate)
          .execute("PersonLocationSetStatus");
      })
      .then((result) => {
        res.send(result.recordsets[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }
);
router.get("/posttypegetalldata", (req, res) => {
  sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool.request().execute("PostTypeGetallData");
    })
    .then((result) => {
      res.send(result.recordsets[0]);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/getpersons/:nationalcode", (req, res) => {
  sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool
        .request()
        .input("NationalCode", sql.NVarChar(10), req.params.nationalcode)
        .execute("GetPersons");
    })
    .then((result) => {
      res.send(result.recordsets[0]);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/getpersondata/:nationalcode", (req, res) => {
  sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool
        .request()
        .input("NationalCode", sql.NVarChar(10), req.params.nationalcode)
        .execute("GetPersonData");
    })
    .then((result) => {
      res.send(result.recordsets[0]);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get(
  "/personadditioninsert/:nationalcode/:addedhours/:addedamount/:paydate/:additiontypeid",
  (req, res) => {
    sql
      .connect(sqlConfig)
      .then((pool) => {
        return pool
          .request()
          .input("NationalCode", sql.NVarChar(10), req.params.nationalcode)
          .input("AddedHours", sql.Float, req.params.addedhours)
          .input("AddedAmount", sql.Float, req.params.addedamount)
          .input("PayDate", sql.NVarChar(6), req.params.paydate)
          .input("AdditionTypeId", sql.Int, req.params.additiontypeid)
          .execute("PersonAdditionInsert");
      })
      .then((result) => {
        res.send(result.recordsets[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }
);
router.get("/personadditiongetalldata/:paydate/:additiontypeid", (req, res) => {
  sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool
        .request()
        .input("PayDate", sql.NVarChar(6), req.params.paydate)
        .input("AdditionTypeId", sql.Int, req.params.additiontypeid)
        .execute("PersonAdditionGetAllData");
    })
    .then((result) => {
      res.send(result.recordsets[0]);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/employmenttypegetalldata", (req, res) => {
  sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool.request().execute("EmploymentTypeGetAllData");
    })
    .then((result) => {
      res.send(result.recordsets[0]);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get(
  "/updatepersons/:nationalcode/:status/:posttypeid/:vajed",
  (req, res) => {
    sql
      .connect(sqlConfig)
      .then((pool) => {
        return pool
          .request()
          .input("NationalCode", sql.NVarChar(10), req.params.nationalcode)
          .input("Status", sql.NVarChar(50), req.params.status)
          .input("Vajed", sql.NVarChar(50), req.params.vajed)
          .input("PostTypeId", sql.Int, req.params.posttypeid)
          .execute("UpdatePersons");
      })
      .then((result) => {
        res.send(result.recordsets[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }
);
router.get("/getmanagerslist/:paydate", (req, res) => {
  sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool
        .request()
        .input("PayDate", sql.NVarChar(50), req.params.paydate)
        .execute("GetManagersList");
    })
    .then((result) => {
      res.send(result.recordsets[0]);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/personslist", (req, res) => {
  sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool.request().execute("PersonsList");
    })
    .then((result) => {
      res.send(result.recordsets[0]);
    })
    .catch((err) => {
      console.log(err);
    });
});
module.exports = router;
