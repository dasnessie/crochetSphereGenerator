// Capitalizes the first char of a string. Returns the string.
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Turns an array into a string of html list elements.
// Takes an array of 2-length arrays (first element is list element, second is
// aria label)
function makeHtmlList(array) {
  // if (array.length == 0) {
  //     return "";
  // }
  let list = "";
  for (const item of array) {
    list += `<li aria-label=\"${item[1]}\">`;
    list += `${item[0]}</li>`;
  }
  return list;
}

export { capitalizeFirstLetter, makeHtmlList };
