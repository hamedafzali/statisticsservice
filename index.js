const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const config = require("config");
const auth = require("./routers/auth");
const persons = require("./routers/persons");
const karaneh = require("./routers/karaneh");
const product = require("./routers/product");
const budget = require("./routers/budget");
const messages = require("./routers/messages");
const tasks = require("./routers/tasks");
var cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("client"));
app.use(morgan("tiny"));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

if (!config.get("jwtPrivateKey")) {
  console.error("could not identify jwtPrivateKey");
  process.exit(1);
}

app.use("/api/auth", auth);
app.use("/api/persons", persons);
app.use("/api/karaneh", karaneh);
app.use("/api/product", product);
app.use("/api/budget", budget);
app.use("/api/messages", messages);
app.use("/api/tasks", tasks);

const port = process.env.port || 8080;
app.listen(port, () => {
  console.log(`Listener is ready on port ${port} ...`);
});
