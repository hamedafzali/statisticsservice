const { sp, sql } = require("../connection");
const express = require("express");
const router = express.Router();
var _ = require("lodash");
const auth = require("../middleware/auth");
router.get("/getbudgettitle/:code", auth, (req, res) => {
  // console.log(req.body.code);
  const result = sp(
    [{ Code: req.params.code, dataType: sql.NVarChar(11) }],
    "getBudgetTitle"
  );
  result.then((r) => res.send(r[0]));
});
router.get("/getbudgetunits", auth, (req, res) => {
  const result = sp([], "getBudgetUnits");
  result.then((r) => res.send(r));
});
router.post("/budgetDocumentInsert", auth, (req, res) => {
  //console.log(req.body);
  const result = sp(
    [
      { Date: req.body.date, dataType: sql.NVarChar(10) },
      { DocumentTypeId: req.body.documentTypeId, dataType: sql.Int },
      { Title: req.body.documentTitle, dataType: sql.NVarChar(100) },
      { DestinationCode: req.body.destinationCode, dataType: sql.NVarChar(10) },
      { UnitCode: req.body.unitCode, dataType: sql.NVarChar(10) },
      { Registrar: req.body.registrar, dataType: sql.NVarChar(10) },
      { Status: req.body.status, dataType: sql.Int },
    ],
    "budgetDocumentInsert"
  );
  result.then((r) => res.send(r[0]));
});
router.post("/budgetinsert", auth, (req, res) => {
  //console.log("budgetinsert", req.body);
  const result = sp(
    [
      { PId: req.body.pid, dataType: sql.Int },
      { Title: req.body.title, dataType: sql.NVarChar(500) },
      { Code: req.body.code, dataType: sql.NVarChar(50) },
      { Level: req.body.level, dataType: sql.Int },
      { isEndPoint: req.body.isendpoint, dataType: sql.Int },
    ],
    "BudgetInsert"
  );
  result.then((r) => res.send(r[0]));
});
router.post("/budgetdocumentdetailinsert", auth, (req, res) => {
  //console.log(req.body);
  const result = sp(
    [
      { PId: req.body.pid, dataType: sql.Int },
      { Title: req.body.title, dataType: sql.NVarChar(500) },
      { Code: req.body.code, dataType: sql.NVarChar(50) },
      { Amount: req.body.amount, dataType: sql.Decimal(20) },
      { Description: req.body.description, dataType: sql.NVarChar(500) },
      { Count: req.body.count, dataType: sql.Int },
      { Id: req.body.id, dataType: sql.Int },
    ],
    "BudgetDocumentDetailInsert"
  );
  //result.then((r) => console.log(r));
  result.then((r) => res.send(r[0]));
});
router.get("/budgetgetdata", auth, (req, res) => {
  const result = sp([], "BudgetGetData");
  result.then((r) => res.send(JSON.stringify(transformToTree(r), null, 2)));
});
router.get(
  "/budgetbalancedocument/:unitcode/:code",
  /*auth, */ (req, res) => {
    const result = sp(
      [
        { UnitCode: req.params.unitcode, dataType: sql.NVarChar(10) },
        { Code: req.params.code, dataType: sql.NVarChar(10) },
      ],
      "BudgetBalanceDocument"
    );
    result.then((r) => res.send(r[0]));
  }
);
router.get("/budgetgetdatawithcode", auth, (req, res) => {
  const result = sp([], "BudgetGetDataWithCode");
  result.then((r) => res.send(r));
});
router.get(
  "/budgetsummary",
  /* auth, */ (req, res) => {
    const result = sp([], "BudgetSummaryReport");
    result.then((r) => res.send(r));
  }
);
router.get("/budgetdocumentgetdata/:nationalcode", (req, res) => {
  const result = sp(
    [{ NationalCode: req.params.nationalcode, dataType: sql.NVarChar(10) }],
    "BudgetDocumentGetData"
  );
  result.then((r) => res.send(r));
});

router.get("/budgetdocumentgetrow/:id", auth, (req, res) => {
  const result = sp(
    [{ Id: req.params.id, dataType: sql.Int }],
    "BudgetDocumentGetRow"
  );
  result.then((r) => res.send(r));
});

router.get("/budgetdocumentdetailgetdata/:pid", auth, (req, res) => {
  const result = sp(
    [{ PId: req.params.pid, dataType: sql.Int }],
    "BudgetDocumentDetailGetData"
  );
  result.then((r) => res.send(r));
});
router.post("/budgetcommit", auth, (req, res) => {
  //console.log(req.body);
  const result = sp(
    [
      { NationalCode: req.body.nationalcode, dataType: sql.NVarChar(10) },
      { Id: req.body.id, dataType: sql.Int },
    ],
    "BudgetCommit"
  );
  result.then((r) => res.send(r[0]));
});
router.post("/budgetuncommit", auth, (req, res) => {
  //console.log(req.body);
  const result = sp(
    [
      { NationalCode: req.body.nationalcode, dataType: sql.NVarChar(10) },
      { Id: req.body.id, dataType: sql.Int },
    ],
    "BudgetUnCommit"
  );
  result.then((r) => res.send(r[0]));
});
router.post("/budgetdetaildelete", auth, (req, res) => {
  console.log(req.body);
  const result = sp(
    [
      { NationalCode: req.body.nationalcode, dataType: sql.NVarChar(10) },
      { Id: req.body.id, dataType: sql.Int },
    ],
    "BudgetDetailDelete"
  );
  result.then((r) => res.send(r[0]));
});
router.get("/budgetdocumentsummary/:pid", auth, (req, res) => {
  const result = sp(
    [{ PId: req.params.pid, dataType: sql.Int }],
    "BudgetDocumentSummary"
  );
  result.then((r) => res.send(r[0]));
});
router.get("/budgetbalance/:code", (req, res) => {
  const result = sp(
    [{ Code: req.params.code, dataType: sql.NVarChar(10) }],
    "BudgetBalance"
  );
  result.then((r) => res.send(r[0]));
});

module.exports = router;

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
