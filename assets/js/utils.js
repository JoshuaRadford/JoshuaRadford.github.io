const themeColors = ["#ff652f", "#e8c100", "#14a76c", "#5479ff", "#856fff"];

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