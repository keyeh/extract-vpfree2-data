// var allHands = require("./allHandsArray.js");
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("testdb-mask-only.db");
var fs = require("fs");

var data = fs.readFileSync("job-9-6.bin");

db.serialize(function () {
  db.run(`
    CREATE TABLE "AllHands" (
      "holdMask"	INTEGER
    );
  `);

  var stmt = `INSERT INTO 'AllHands' ('holdMask') VALUES\n`;
  let iterations = 2598960

  for (let i = 0; i < iterations; i++) {
    uint = data.readUInt8(i);
    stmt += `(${dec2bin(uint)})`;
    if(i < iterations -1) stmt += ',\n'
    i % 10000 === 0 && console.log(i, uint, dec2bin(uint) );
  }
  stmt += ';'
  db.run(stmt);
});

db.close();



function dec2bin(dec){
    return (dec >>> 0).toString(2).padStart(5, 0);
}
