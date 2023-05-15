// Capitalizes the first char of a string. Returns the string.
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Turns an array into a string of html list elements.
function makeHtmlList(array) {
    let list = "<li>";
    list += array.join("</li>\n<li>");
    list += "</li>\n";
    return list;
}

export { capitalizeFirstLetter, makeHtmlList };