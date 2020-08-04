const { theirHandStringToMyHandString, theirHoldStringToInt } = require("./utils");
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("jacks-9-6.db");
var fs = require("fs");
let i = 0;

let solutionInts = [];

db.each(
  "SELECT * FROM AllHands",
  function (err, row) {
    const hand = theirHandStringToMyHandString(row.hand);
    const holdInt = theirHoldStringToInt(row.hand);
    solutionInts.push(holdInt);
    // console.log(hand, holdBitString, holdInt );
    // process.exit()
    if (i % 10000 === 0) console.log(i);
    i++;
  },
  () => {
    // complete
    console.log(solutionInts.length);
    const buf = Buffer.allocUnsafe(solutionInts.length);
    solutionInts.map((int, index) => {
      buf.writeUInt8(int, index);
    });
    fs.writeFileSync("jacks-9-6.bin", buf, function (err) {
      console.log(err);
    });
  }
);
