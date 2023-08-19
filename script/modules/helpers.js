// Capitalizes the first char of a string. Returns the string.
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Turns an array into a string of html list elements.
// Takes an array of list items, returns an string containing the list
function makeHtmlList(array) {
  // if (array.length == 0) {
  //     return "";
  // }
  let list = "";
  for (const item of array) {
    // list += `<li aria-label=\"${item[1]}\">`;
    list += `<li>${item}</li>`;
  }
  return list;
}

export { capitalizeFirstLetter, makeHtmlList };
