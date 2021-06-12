const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const config = require("config");
var _ = require("lodash");
const { request } = require("express");
router.get("/chartperson/:id/", (req, res) => {
  const { username, password, host } = config.get("sql");
  const sqlConfig = {
    user: username,
    password: password,
    server: host, // You can use 'localhost\\instance' to connect to named instance
    database: "Statistics",
  };
  //console.log(sqlConfig)
  //res.send(sqlConfig);
  const sql = require("mssql");

  // sql.on('error', err => {
  //     // ... error handler
  // })

  sql
    .connect(sqlConfig)
    .then((pool) => {
      // Stored procedure
      return (
        pool
          .request()
          .input("Id", sql.NVarChar(10), req.params.id)
          //.output('output_parameter', sql.VarChar(50))
          .execute("getChartPersons")
      );
    })
    .then((result) => {
      res.send(JSON.stringify(transformToTree(result.recordsets[0]), null, 2));
    })
    .catch((err) => {
      // ... error checks
      console.log(err);
    });
  //res.send(users);
});
router.get("/chart/:id/", (req, res) => {
  const { username, password, host } = config.get("sql");
  const sqlConfig = {
    user: username,
    password: password,
    server: host, // You can use 'localhost\\instance' to connect to named instance
    database: "Statistics",
  };
  //console.log(sqlConfig)
  //res.send(sqlConfig);
  const sql = require("mssql");

  // sql.on('error', err => {
  //     // ... error handler
  // })

  sql
    .connect(sqlConfig)
    .then((pool) => {
      // Stored procedure
      return (
        pool
          .request()
          .input("Id", sql.NVarChar(10), req.params.id)
          //.output('output_parameter', sql.VarChar(50))
          .execute("getChart")
      );
    })
    .then((result) => {
      res.send(JSON.stringify(transformToTree(result.recordsets[0]), null, 2));
    })
    .catch((err) => {
      // ... error checks
      console.log(err);
    });
  //res.send(users);
});
//router.get("/", auth, () => {});
router.get(
  "/chartupdate/:nationalcode/:sourceid/:description/:destinationcode/:destinationname/:destinationid/:tel/:paydate/:registrar",

  (req, res) => {
    //console.log(req.params);
    const { username, password, host } = config.get("sql");
    const sqlConfig = {
      user: username,
      password: password,
      server: host, // You can use 'localhost\\instance' to connect to named instance
      database: "Statistics",
    };
    //console.log(sqlConfig)
    //res.send(sqlConfig);
    const sql = require("mssql");

    // sql.on('error', err => {
    //     // ... error handler
    // })

    sql
      .connect(sqlConfig)
      .then((pool) => {
        // Stored procedure
        return (
          pool

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
            //.output('output_parameter', sql.VarChar(50))
            .execute("RelocateRequestInsert")
        );
      })
      .then((result) => {
        res.send(result.recordsets[0]);
      })
      .catch((err) => {
        // ... error checks
        console.log(err);
      });
    //res.send(users);
  }
);

// router.get(
//   "/relocaterequest/:nationalcode/:namefamily/:description/:destination/:managernationalcode",
//   (req, res) => {
//     const { username, password, host } = config.get("sql");
//     const sqlConfig = {
//       user: username,
//       password: password,
//       server: host, // You can use 'localhost\\instance' to connect to named instance
//       database: "Statistics",
//     };
//     console.log(req.params);
//     const sql = require("mssql");

//     sql
//       .connect(sqlConfig)
//       .then((pool) => {
//         // Stored procedure
//         return (
//           pool
//             .request()
//             .input("NationalCode", sql.NVarChar(10), req.params.nationalcode)
//             .input("NameFamily", sql.NVarChar(500), req.params.namefamily)
//             .input("Description", sql.NVarChar(4000), req.params.description)
//             .input("Destination", sql.NVarChar(4000), req.params.destination)
//             .input(
//               "ManagerNationalCode",
//               sql.NVarChar(10),
//               req.params.managernationalcode
//             )
//             //.output('output_parameter', sql.VarChar(50))
//             .execute("RelocateRequestInsert")
//         );
//       })
//       .then((result) => {
//         res.send(result);
//       })
//       .catch((err) => {
//         // ... error checks
//         console.log(err);
//       });
//     //res.send(users);
//   }
// );
// router.get("/relocaterequestalldata/:managernationalcode", (req, res) => {
//   const { username, password, host } = config.get("sql");
//   const sqlConfig = {
//     user: username,
//     password: password,
//     server: host, // You can use 'localhost\\instance' to connect to named instance
//     database: "Statistics",
//   };
//   console.log(req.params);
//   const sql = require("mssql");

//   sql
//     .connect(sqlConfig)
//     .then((pool) => {
//       // Stored procedure
//       return (
//         pool
//           .request()
//           .input(
//             "NationalCode",
//             sql.NVarChar(10),
//             req.params.managernationalcode
//           )
//           //.output('output_parameter', sql.VarChar(50))
//           .execute("RelocateRequestGetallData")
//       );
//     })
//     .then((result) => {
//       res.send(result.recordsets[0]);
//     })
//     .catch((err) => {
//       // ... error checks
//       console.log(err);
//     });
//   //res.send(users);
// });
function transformToTree(arr) {
  var nodes = {};
  return arr.filter((obj) => {
    var id = obj["key"],
      parentId = obj["PId"];
    //console.log({ index: obj.index, label: obj.label });
    nodes[id] = _.defaults(obj, nodes[id], { nodes: [] });
    //console.log(nodes[id]);
    parentId &&
      (nodes[parentId] = nodes[parentId] || { nodes: [] })["nodes"].push(obj);

    return !parentId;
  });
}
router.get("/getrelocaterequest/:paydate/:nationalcode", (req, res) => {
  console.log(req.params);
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
  const { username, password, host } = config.get("sql");
  const sqlConfig = {
    user: username,
    password: password,
    server: host, // You can use 'localhost\\instance' to connect to named instance
    database: "Statistics",
  };
  //console.log(sqlConfig)
  //res.send(sqlConfig);
  const sql = require("mssql");

  // sql.on('error', err => {
  //     // ... error handler
  // })

  sql
    .connect(sqlConfig)
    .then((pool) => {
      // Stored procedure
      return (
        pool
          .request()
          .input("Id", sql.Int, req.params.id)
          .input("NationalCode", sql.NVarChar(50), req.params.nationalcode)
          //.output('output_parameter', sql.VarChar(50))
          .execute("CommitRelocateRequest")
      );
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
router.get(
  "/personlocationsetstatus/:nationalcode/:description/:sourceid/:registrar/:paydate",
  (req, res) => {
    const { username, password, host } = config.get("sql");
    const sqlConfig = {
      user: username,
      password: password,
      server: host, // You can use 'localhost\\instance' to connect to named instance
      database: "Statistics",
    };
    //console.log(sqlConfig)
    //res.send(sqlConfig);
    const sql = require("mssql");

    // sql.on('error', err => {
    //     // ... error handler
    // })

    sql
      .connect(sqlConfig)
      .then((pool) => {
        // Stored procedure
        return (
          pool
            .request()
            .input("NationalCode", sql.NVarChar(10), req.params.nationalcode)
            .input("Description", sql.NVarChar(500), req.params.description)
            .input("sourceid", sql.Int, req.params.sourceid)
            .input("registrar", sql.NVarChar(10), req.params.registrar)
            .input("Paydate", sql.NVarChar(6), req.params.paydate)
            //.output('output_parameter', sql.VarChar(50))
            .execute("PersonLocationSetStatus")
        );
      })
      .then((result) => {
        res.send(result.recordsets[0]);
      })
      .catch((err) => {
        // ... error checks
        console.log(err);
      });
    //res.send(users);
  }
);
router.get("/posttypegetalldata", (req, res) => {
  const { username, password, host } = config.get("sql");
  const sqlConfig = {
    user: username,
    password: password,
    server: host, // You can use 'localhost\\instance' to connect to named instance
    database: "Statistics",
  };
  //console.log(sqlConfig)
  //res.send(sqlConfig);
  const sql = require("mssql");

  // sql.on('error', err => {
  //     // ... error handler
  // })

  sql
    .connect(sqlConfig)
    .then((pool) => {
      // Stored procedure
      return (
        pool
          .request()
          //.output('output_parameter', sql.VarChar(50))
          .execute("PostTypeGetallData")
      );
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
router.get("/getpersons/:nationalcode", (req, res) => {
  const { username, password, host } = config.get("sql");
  const sqlConfig = {
    user: username,
    password: password,
    server: host, // You can use 'localhost\\instance' to connect to named instance
    database: "Statistics",
  };
  //console.log(sqlConfig)
  //res.send(sqlConfig);
  const sql = require("mssql");

  // sql.on('error', err => {
  //     // ... error handler
  // })

  sql
    .connect(sqlConfig)
    .then((pool) => {
      // Stored procedure
      return (
        pool
          .request()
          .input("NationalCode", sql.NVarChar(10), req.params.nationalcode)
          //.output('output_parameter', sql.VarChar(50))
          .execute("GetPersons")
      );
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
router.get("/getpersondata/:nationalcode", (req, res) => {
  const { username, password, host } = config.get("sql");
  const sqlConfig = {
    user: username,
    password: password,
    server: host, // You can use 'localhost\\instance' to connect to named instance
    database: "Statistics",
  };
  //console.log(sqlConfig)
  //res.send(sqlConfig);
  const sql = require("mssql");

  // sql.on('error', err => {
  //     // ... error handler
  // })

  sql
    .connect(sqlConfig)
    .then((pool) => {
      // Stored procedure
      return (
        pool
          .request()
          .input("NationalCode", sql.NVarChar(10), req.params.nationalcode)
          //.output('output_parameter', sql.VarChar(50))
          .execute("GetPersonData")
      );
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
router.get(
  "/personadditioninsert/:nationalcode/:addedhours/:addedamount/:paydate/:additiontypeid",
  (req, res) => {
    //console.log(req.params);
    const { username, password, host } = config.get("sql");
    const sqlConfig = {
      user: username,
      password: password,
      server: host,
      database: "Statistics",
    };
    const sql = require("mssql");
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
  //console.log(req.params);
  const { username, password, host } = config.get("sql");
  const sqlConfig = {
    user: username,
    password: password,
    server: host,
    database: "Statistics",
  };
  const sql = require("mssql");
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
  //console.log(req.params);
  const { username, password, host } = config.get("sql");
  const sqlConfig = {
    user: username,
    password: password,
    server: host,
    database: "Statistics",
  };
  const sql = require("mssql");
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
    //console.log(req.params);
    const { username, password, host } = config.get("sql");
    const sqlConfig = {
      user: username,
      password: password,
      server: host,
      database: "Statistics",
    };
    const sql = require("mssql");
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
  //console.log(req.params);
  const { username, password, host } = config.get("sql");
  const sqlConfig = {
    user: username,
    password: password,
    server: host,
    database: "Statistics",
  };
  const sql = require("mssql");
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
  //console.log(req.params);
  const { username, password, host } = config.get("sql");
  const sqlConfig = {
    user: username,
    password: password,
    server: host,
    database: "Statistics",
  };
  const sql = require("mssql");
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
