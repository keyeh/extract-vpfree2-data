/**
 
#################################################################################
######### Ripping from vpfree2
Ace -> King = 1 -> 13

Clubs = +0
Diamond = +100
Heart = +200
Spade = +300

Clubs
Ace: c001
Ten: c010
King: c013

Diamond
Ace: c101
Ten: c110
King: c113

Heart
Ace: c201
Ten: c210
King: c213


Spade
Ace: c301
Ten: c310
King: c313


No selection: c400

var start = window.performance.now();
evs = this.wasm.getEVs(["c001", "c002", "c003", "c005", "c010"])[0]
var end = window.performance.now();
console.log(`Execution time: ${end - start} ms`);


average 5ms
2,598,960 x 5ms = 3.60966667 hours

///////////////////////////////////////////////////
Open chrome without CORS

open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security

*/



// https://stackoverflow.com/a/54385026
function* range(start, end) {
  for (; start <= end; ++start) { yield start; }
}
function last(arr) { return arr[arr.length - 1]; }
function* numericCombinations(n, r, loc = []) {
  const idx = loc.length;
  if (idx === r) {
    yield loc;
    return;
  }
  for (let next of range(idx ? last(loc) + 1 : 0, n - r + idx)) { yield* numericCombinations(n, r, loc.concat(next)); }
}
function* combinations(arr, r) {
  for (let idxs of numericCombinations(arr.length, r)) { yield idxs.map(i => arr[i]); }
}
myDeck = ['Ac','Ad','Ah','As','2c','2d','2h','2s','3c','3d','3h','3s','4c','4d','4h','4s','5c','5d','5h','5s','6c','6d','6h','6s','7c','7d','7h','7s','8c','8d','8h','8s','9c','9d','9h','9s','Tc','Td','Th','Ts','Jc','Jd','Jh','Js','Qc','Qd','Qh','Qs','Kc','Kd','Kh','Ks']
deck = myDeck.map(card => {
    const pip = card[0]
    const suit = card[1]
    let result = 0

    if(suit === "c") result += 0
    if(suit === "d") result += 100
    if(suit === "h") result += 200
    if(suit === "s") result += 300

    if(pip === "A") result += 1
    else if(pip === "T") result += 10
    else if(pip === "J") result += 11
    else if(pip === "Q") result += 12
    else if(pip === "K") result += 13
    else result += parseInt(pip)

    return "c" + result.toString().padStart(3, 0)
})


allHands = []
for (let hand of combinations(deck, 5)) {
    allHands.push(hand)
}

async function ripIt(startIndex, chunk=1000) {
    results = []
    for(let i=startIndex; i < chunk+startIndex; i++) {
        const hand = allHands[i]
        const ev = window.game.wasm.getEVs(hand)[0]

        results.push({
            hand: hand.join(),
            holdBitCodeL2R: ev.holdBitCodeL2R.join(),
            ev: ev.ev,
            tie: Number(ev.tie)
        })
    }

    console.log(new Date().toString(), startIndex, startIndex+chunk)
    headers = new Headers()
    headers.append("Content-Type", "application/json")
    return fetch("http://localhost:9000/", {
        method: "POST",
        headers,
        body: JSON.stringify(results),
    })
    // debugger;
}

for(let k=0; k<2598960; k+=1000) {
    await ripIt(k).then(console.log);
}
await ripIt(2598000,960).then(console.log);


// 4000/second = 
// 2598960 / 4000 = 649.74 seconds = 10.8 minutes

// Mon Aug 03 2020 13:09:20 GMT-0700 (Pacific Daylight Time) 1000
// Mon Aug 03 2020 13:22:00 GMT-0700 (Pacific Daylight Time) 1000
