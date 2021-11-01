const express = require("express");
const router = express.Router();
var path = require("path");
const fs = require("fs");

let projectLocation = `${path.dirname(
  require.main.filename || process.mainModule.filename
)}/public/files`;
const CheckDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};
router.post("/:type", (req, res) => {
  var dir = `${projectLocation}`;
  //CheckDir(dir);
  //console.log(req.files);
  let imageFile = req.files.file;
  //let fileLocation;
  //   if (req.params.type === "budget")
  //     fileLocation = `${path.dirname(
  //       require.main.filename || process.mainModule.filename
  //     )}/public/files/budget/${req.files.file.name}`;
  //console.log(`${dir}/${req.params.type}/${req.files.file.name}`);
  CheckDir(`${dir}/${req.params.type}/`);
  //return;
  imageFile.mv(`${dir}/${req.params.type}/${req.files.file.name}`, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    return res.status(200).send({ name: req.files.file.name });
  });
});

router.get("/:type/:fileName", function (req, res) {
  console.log("Called...");
  fileLocation = `${path.dirname(
    require.main.filename || process.mainModule.filename
  )}/public/files/${req.params.type}/${req.params.fileName}`;

  res.download(fileLocation); // Set disposition and send it.
});
router.get("/:type", function (req, res) {
  fs.readdir(`${projectLocation}/${req.params.type}/`, (err, files) => {
    //console.log(files);
    res.status(200).send(files);
  });
});

module.exports = router;
