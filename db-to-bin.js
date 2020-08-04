var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("jacks-9-6.db");
var fs = require("fs");
let i = 0



let solutionInts = []

db.each("SELECT * FROM AllHands", function(err, row) {
    const hand = theirHandStringToMyHandString(row.hand)
    const holdBitString = row.holdBitCodeL2R.replace(/,/g, '')
    const holdInt = parseInt(holdBitString.padStart(8, '0'), 2 );
    solutionInts.push(holdInt)
    // console.log(hand, holdBitString, holdInt );
    // process.exit()
    if(i % 10000 === 0) console.log(i)
    i++
}, () => {
    // complete
    console.log(solutionInts.length)
    const buf = Buffer.allocUnsafe(solutionInts.length);
    solutionInts.map((int, index) => {
        buf.writeUInt8(int, index);
    })
    fs.writeFileSync('jacks-9-6.txt', buf, function(err) {
        console.log(err)
    });
});


function theirHandStringToMyHandString(handString) {
    // const handString = "c004,c305,c108,c308,c109"
    const handArray = handString.replace(/c/g, '').split(',')
    return handArray.map(theirCardStringToMyCardString).join('')
}

function theirCardStringToMyCardString(card) {
    const suit = parseInt(card[0])
    const pip = parseInt(card[1] + card[2])
    let result = ""

    if(pip === 1) result += "A"
    else if(pip === 10) result += "T"
    else if(pip === 11) result += "J"
    else if(pip === 12) result += "Q"
    else if(pip === 13) result += "K"
    else result += pip

    if(suit === 0) result += "c"
    if(suit === 1) result += "d"
    if(suit === 2) result += "h"
    if(suit === 3) result += "s"

    return result
}
