const themeColors = ["#390099", "#3772FF", "#20FC8F", "#F5E663", "#F7B32B", "#A5402D"];

const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function isColor(strColor) {
    var s = new Option().style;
    s.color = strColor;
    return s.color == strColor;
}


export { clamp, getRandomInt, isColor, themeColors };