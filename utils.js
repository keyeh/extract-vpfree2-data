function theirHandStringToMyHandString(handString) {
  // const handString = "c004,c305,c108,c308,c109"
  const handArray = handString.replace(/c/g, "").split(",");
  return handArray.map(theirCardStringToMyCardString).join("");
}

function theirCardStringToMyCardString(card) {
  const suit = parseInt(card[0]);
  const pip = parseInt(card[1] + card[2]);
  let result = "";

  if (pip === 1) result += "A";
  else if (pip === 10) result += "T";
  else if (pip === 11) result += "J";
  else if (pip === 12) result += "Q";
  else if (pip === 13) result += "K";
  else result += pip;

  if (suit === 0) result += "c";
  if (suit === 1) result += "d";
  if (suit === 2) result += "h";
  if (suit === 3) result += "s";

  return result;
}

function theirHoldStringToInt(holdBitCodeL2R) {
  const holdBitString = holdBitCodeL2R.replace(/,/g, "");
  return parseInt(holdBitString.padStart(8, "0"), 2);
}

module.exports = { theirHandStringToMyHandString, theirHoldStringToInt };
