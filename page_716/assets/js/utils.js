function getRandomValue(min, max)
{
    return Math.random() * (max - min) + min;
}

function degToRad(number)
{
    return number * Math.PI / 180;
}

function clearSelection()
{
    if (document.selection && document.selection.empty)
    {
        document.selection.empty();
    }
    else if (window.getSelection)
    {
        var sel = window.getSelection();
        sel.removeAllRanges();
    }
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

export { getRandomValue, degToRad, clearSelection, sleep };