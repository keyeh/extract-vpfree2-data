const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();
var cors = require('cors')

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("double-bonus9911.db");
var fs = require("fs");

db.serialize(function () {
  db.run(`
        CREATE TABLE if not exists "AllHands" (
            "hand"	TEXT,
            "holdBitCodeL2R"	TEXT,
            "ev"	NUMERIC,
            "tie"	INTEGER
        );
  `);

})

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(cors());

app.post('/', cors(), function (req, res) {
    results = req.body
    var stmt = `INSERT INTO 'AllHands' ('hand', 'holdBitCodeL2R', 'ev', 'tie') VALUES\n`;
    results.map((result, i) => {
        stmt += `("${result.hand}", "${result.holdBitCodeL2R}", ${result.ev}, ${result.tie})`
        if(i < results.length -1) stmt += ',\n'
    })
    stmt += ';'
    db.run(stmt);
    console.log(new Date().toString(), results.length)
    res.send('ok')
})

// add router in the Express app.
app.use("/", router);

app.listen(9000,() => {
  console.log("Started on PORT 9000");
})
