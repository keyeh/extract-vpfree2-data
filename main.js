var allHands = require("./allHandsArray.js");
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("testdb-binary-mask.db");
var fs = require("fs");

var data = fs.readFileSync("job-9-6.bin");

db.serialize(function () {
  db.run(`
    CREATE TABLE "AllHands" (
      "id"	INTEGER,
      "holdMask"	INTEGER,
      PRIMARY KEY("id")
    );
  `);

  var stmt = `INSERT INTO 'AllHands' ('id', 'holdMask') VALUES\n`;
  let iterations = allHands.length

  for (let i = 0; i < iterations; i++) {
    uint = data.readUInt8(i);
    // stmt += `INSERT INTO AllHands VALUES (${allHands[i]}, ${uint});\n`
    stmt += `(${allHands[i]}, ${dec2bin(uint)})`;
    if(i < iterations -1) stmt += ',\n'
    i % 10000 === 0 && console.log(i, allHands[i], uint, dec2bin(uint) );
  }
  stmt += ';'
  // console.log(stmt)
  db.run(stmt);
});

db.close();



function dec2bin(dec){
    return (dec >>> 0).toString(2).padStart(5, 0);
}
