// https://stackoverflow.com/a/54385026
const fs = require('fs')
function* range(start, end) {
  for (; start <= end; ++start) {
    yield start;
  }
}
function last(arr) {
  return arr[arr.length - 1];
}
function* numericCombinations(n, r, loc = []) {
  const idx = loc.length;
  if (idx === r) {
    yield loc;
    return;
  }
  for (let next of range(idx ? last(loc) + 1 : 0, n - r + idx)) {
    yield* numericCombinations(n, r, loc.concat(next));
  }
}
function* combinations(arr, r) {
  for (let idxs of numericCombinations(arr.length, r)) {
    yield idxs.map((i) => arr[i]);
  }
}
// combinatics

function encode(choices) {
  let sortedChoices = choices.sort((a, b) => b - a);
  var k = choices.length;
  var result = 0;
  for (const choice of sortedChoices) {
    result += binom(choice, k);
    k -= 1;
  }
  return result;
}
function binom(n, k) {
  if (k === 0) return 1;
  return (n * binom(n - 1, k - 1)) / k;
}
function dec2bin(dec) {
  return (dec >>> 0).toString(2);
}

// prettier-ignore
let oldDeck = ["CA", "DA", "HA", "SA", "C2", "D2", "H2", "S2", "C3", "D3", "H3", "S3", "C4", "D4", "H4", "S4", "C5", "D5", "H5", "S5", "C6", "D6", "H6", "S6", "C7", "D7", "H7", "S7", "C8", "D8", "H8", "S8", "C9", "D9", "H9", "S9", "CT", "DT", "HT", "ST", "CJ", "DJ", "HJ", "SJ", "CQ", "DQ", "HQ", "SQ", "CK", "DK", "HK", "SK"]

const allHands = []
for (let hand of combinations(oldDeck, 5)) {
  allHands.push(hand);
}

function convertExtractedDataToCombinatics(binName) {
  var data = fs.readFileSync(`./extracted-data/${binName}`);

  const buf = Buffer.alloc(allHands.length);

  for (let i = 0; i < allHands.length; i++) {
    const cards = allHands[i]
    const hold = data[i]
    const holdArray = dec2bin(hold).padStart(5, '0').split('').map(c => c === "1")
    let sortedCardsWithHolds = cards.map((c, j) => ({ cardIndex: oldDeck.indexOf(c), hold: holdArray[j] })).sort((a, b) => b.cardIndex - a.cardIndex)

    const sortedCards = sortedCardsWithHolds.map(o => o.cardIndex)
    const sortedHolds = sortedCardsWithHolds.map(o => o.hold)

    const index = encode(sortedCards)
    const holdNumberValue = sortedHolds.reduce((res, x) => res << 1 | x)

    // console.log(index, cards, holdArray, sortedCards, holdNumberValue)
    buf.writeUInt8(holdNumberValue, index);
    // break
  }
  fs.writeFileSync(`./converted-data/${binName}`, buf, function (err) {
    console.log(err);
  });
}


convertExtractedDataToCombinatics('bonuspoker9917.bin')
convertExtractedDataToCombinatics('deuces-wild-44-9891.bin')
convertExtractedDataToCombinatics('double-bonus9911.bin')
convertExtractedDataToCombinatics('double-double-bonus9898.bin')