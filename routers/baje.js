const { sp, sql } = require("../connection");
const express = require("express");
const router = express.Router();

router.get("/bajemanabehsummary", (req, res) => {
  const result = sp([], "BajeManabehSummary");
  result.then((r) => res.send(r));
});

router.get("/bajemanabeh/:date", (req, res) => {
  const result = sp(
    [{ Date: req.params.date, dataType: sql.NVarChar(10) }],
    "BajeManabehGet"
  );
  result.then((r) => res.send(r));
});

router.post("/bajemanabehread", (req, res) => {
  //console.log(req.body);
  const result = sp(
    [
      { FileLocation: req.body.filelocation, dataType: sql.NVarChar(500) },
      { Date: req.body.date, dataType: sql.NVarChar(10) },
    ],
    "BajeManabehReadFile"
  );
  result.then((r) => res.send(r));
});

router.get("/bajemanabehdehyarisummary", (req, res) => {
  const result = sp([], "BajeManabehDehyariSummary");
  result.then((r) => res.send(r));
});
router.get("/bajemanabehdehyari/:date", (req, res) => {
  const result = sp(
    [{ Date: req.params.date, dataType: sql.NVarChar(10) }],
    "BajeManabehDehyariGet"
  );
  result.then((r) => res.send(r));
});
router.post("/bajemanabehdehyariread", (req, res) => {
  //console.log(req.body);
  const result = sp(
    [
      { FileLocation: req.body.filelocation, dataType: sql.NVarChar(500) },
      { Date: req.body.date, dataType: sql.NVarChar(10) },
    ],
    "BajeManabehDehyariReadFile"
  );
  result.then((r) => res.send(r));
});
module.exports = router;
