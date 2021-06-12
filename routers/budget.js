const { sp, sql } = require("../connection");
const express = require("express");
const router = express.Router();

router.get("/getbudgettitle/:code", (req, res) => {
  // console.log(req.body.code);
  const result = sp(
    [{ Code: req.params.code, dataType: sql.NVarChar(11) }],
    "getBudgetTitle"
  );
  result.then((r) => res.send(r[0]));
});
router.get("/getbudgetunits", (req, res) => {
  const result = sp([], "getBudgetUnits");
  result.then((r) => res.send(r));
});
router.post("/budgetDocumentInsert", (req, res) => {
  //console.log(req.body);
  const result = sp(
    [
      { Date: req.body.date, dataType: sql.NVarChar(10) },
      { DocumentTypeId: req.body.documentTypeId, dataType: sql.Int },
      { Title: req.body.documentTitle, dataType: sql.NVarChar(100) },
      { DestinationCode: req.body.destinationCode, dataType: sql.NVarChar(10) },
      { UnitCode: req.body.unitCode, dataType: sql.NVarChar(10) },
      { Registrar: req.body.registrar, dataType: sql.NVarChar(10) },
    ],
    "budgetDocumentInsert"
  );
  result.then((r) => res.send(r[0]));
});
router.post("/budgetinsert", (req, res) => {
  //console.log(req.body);
  const result = sp(
    [
      { Title: req.body.title, dataType: sql.NVarChar(500) },
      { Code: req.body.code, dataType: sql.NVarChar(50) },
    ],
    "budgetInsert"
  );
  result.then((r) => res.send(r[0]));
});
router.post("/budgetdocumentdetailinsert", (req, res) => {
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
  result.then((r) => res.send(r[0]));
});
router.get("/budgetgetdata", (req, res) => {
  const result = sp([], "BudgetGetData");
  result.then((r) => res.send(r));
});

router.get("/budgetdocumentgetdata/:nationalcode", (req, res) => {
  const result = sp(
    [{ NationalCode: req.params.nationalcode, dataType: sql.NVarChar(10) }],
    "BudgetDocumentGetData"
  );
  result.then((r) => res.send(r));
});

router.get("/budgetdocumentgetrow/:id", (req, res) => {
  const result = sp(
    [{ Id: req.params.id, dataType: sql.Int }],
    "BudgetDocumentGetRow"
  );
  result.then((r) => res.send(r));
});

router.get("/budgetdocumentdetailgetdata/:pid", (req, res) => {
  const result = sp(
    [{ PId: req.params.pid, dataType: sql.Int }],
    "BudgetDocumentDetailGetData"
  );
  result.then((r) => res.send(r));
});
router.post("/budgetcommit", (req, res) => {
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
router.post("/budgetuncommit", (req, res) => {
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
router.post("/budgetdetaildelete", (req, res) => {
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
router.get("/budgetdocumentsummary/:pid", (req, res) => {
  const result = sp(
    [{ PId: req.params.pid, dataType: sql.Int }],
    "BudgetDocumentSummary"
  );
  result.then((r) => res.send(r[0]));
});
module.exports = router;
