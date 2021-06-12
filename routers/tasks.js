const { sp, sql } = require("../connection");
const express = require("express");
const router = express.Router();

router.get("/tasksgetdata", (req, res) => {
  const result = sp([], "TasksGetData");
  result.then((r) => res.send(r));
});

module.exports = router;
