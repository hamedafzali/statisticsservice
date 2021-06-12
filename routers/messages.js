const { sp, sql } = require("../connection");
const express = require("express");
const router = express.Router();

router.get("/messageallunits", (req, res) => {
  const result = sp([], "MessageAllUnits");
  result.then((r) => res.send(r));
});

router.post("/message", (req, res) => {
  //console.log(req.body);
  //res.send(req.body);
  const result = sp(
    [
      { Title: req.body.title, dataType: sql.NVarChar(500) },
      { Body: req.body.body, dataType: sql.NVarChar(sql.MAX) },
      { Sender: req.body.sender, dataType: sql.NVarChar(100) },
      { SenderUnit: req.body.senderUnit, dataType: sql.NVarChar(10) },
      { Reciever: req.body.reciever, dataType: sql.NVarChar(10) },
      { RecieverUnit: req.body.recieverUnit, dataType: sql.NVarChar(10) },
    ],
    "MessageInsert"
  );
  result.then((r) => res.send(r[0]));
});

module.exports = router;
