const themeColors = [
    "#390099",
    "#3772FF",
    "#20FC8F",
    "#F5E663",
    "#F7B32B",
    "#A5402D"
];

const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function isColor(strColor) {
    let s = new Option().style;
    s.color = strColor;
    return s.color === strColor;
}

function abbreviateOrAcronym(str) {
  const stopWords = new Set(["and", "of", "the", "in", "on", "at"]);
  const words = str.trim().split(/\s+/);

  if (words.length > 1) {
    // Multiword → Acronym
    return words
      .filter(w => w && !stopWords.has(w.toLowerCase()))
      .map(w => w[0].toUpperCase())
      .join("");
  } else {
    // Single word → Abbreviation
    const word = words[0];
    if (word.length <= 4) return word;
    return word.slice(0, 3);
  }
}


export { clamp, getRandomInt, isColor, themeColors, abbreviateOrAcronym };