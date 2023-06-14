// Capitalizes the first char of a string. Returns the string.
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Turns an array into a string of html list elements.
function makeHtmlList(array) {
    if (array.length == 0) {
        return "";
    }
    let list = "<li>";
    list += array.join("</li><li>");
    list += "</li>";
    return list;
}

export { capitalizeFirstLetter, makeHtmlList };