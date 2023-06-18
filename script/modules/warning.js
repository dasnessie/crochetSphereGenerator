// Shows a warning in the crochet pattern.
// Takes a title (like "Error" or "Warning") and the warning message.
function showWarning(title, warning) {
  let element = document.getElementById("patternWarning");
  element.innerHTML = `<strong>${title}:</strong> `;
  element.innerHTML += warning;
  element.style.display = "block";
}

// Hides the warning in the crochet pattern
function hideWarning() {
  document.getElementById("patternWarning").style.display = "none";
}

export { showWarning, hideWarning };
