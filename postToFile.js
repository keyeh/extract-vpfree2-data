const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();
var cors = require("cors");
var fs = require("fs");
const { theirHoldStringToInt } = require("./utils");
const name = "jacks-9-6";

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(cors());

app.post("/", cors(), function (req, res) {
  results = req.body;
  const buf = Buffer.allocUnsafe(results.length);
  results.map((result, i) => {
    const holdInt = theirHoldStringToInt(result.holdBitCodeL2R);
    buf.writeUInt8(holdInt, i);
  });
  console.log(new Date().toString(), results.length);
  res.send("ok");
  fs.appendFile(`${name}.bin`, buf, function (err) {
    console.log(err);
  });
});

// add router in the Express app.
app.use("/", router);

app.listen(9000, () => {
  console.log("Started on PORT 9000");
});
