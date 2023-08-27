import { makeHtmlList } from "./modules/helpers.js";
import { showWarning, hideWarning } from "./modules/warning.js";
import { generatePattern } from "./modules/patternGenerator.js";

window.onload = displayCustomStitchInput;

document
  .querySelector("#stitchSelect")
  .addEventListener("change", displayCustomStitchInput);

let current_scale = 1;
const increaseFontButton = document.getElementById("increase-font");
const decreaseFontButton = document.getElementById("decrease-font");
const resetFontButton = document.getElementById("reset-font");

increaseFontButton.addEventListener("click", () => {
  adjustFontSizes(1.1);
});

decreaseFontButton.addEventListener("click", () => {
  adjustFontSizes(1/1.1);
});

resetFontButton.addEventListener("click", () => {
  adjustFontSizes(1/current_scale);
})

// Hide and show the section of the form to input custom stitch
function displayCustomStitchInput() {
  if (document.querySelector("#stitchSelect").value == "custom") {
    document.getElementById("customStitch").style.display = "block";
    document.getElementById("stWidth").required = true;
    document.getElementById("stHeight").required = true;
  } else {
    document.getElementById("customStitch").style.display = "none";
    document.getElementById("stWidth").required = false;
    document.getElementById("stHeight").required = false;
  }
}

// On form submit
document.querySelector("#formElem").addEventListener("submit", (e) => {
  e.preventDefault();

  let form = e.target;
  let data = new FormData(form);

  const stitches = {
    sc: {
      short: "sc",
      name: "single crochet",
      titleName: "single crochet (sc)",
      ratio: 5.5 / 4.5,
      chainCount: 1,
    },
    hdc: {
      short: "hdc",
      name: "half double crochet",
      titleName: "half double crochet (hdc)",
      ratio: 5.5 / 7,
      chainCount: 2,
    },
    dc: {
      short: "dc",
      name: "double crochet",
      titleName: "double crochet (dc)",
      ratio: 5.5 / 10.5,
      chainCount: 3,
    },
    tr: {
      short: "tr",
      name: "treble crochet",
      titleName: "treble crochet (tr)",
      ratio: 6.5 / 15.5,
      chainCount: 4,
    },
    custom: {
      short: "st",
      name: "stitch",
      titleName: "a custom stitch (st)",
      ratio: data.get("stWidth") / data.get("stHeight"),
      chainCount: Math.ceil(data.get("stHeight") / data.get("stWidth")),
    },
  };

  const circumference = data.get("circumference");
  const stitch = stitches[data.get("stitch")];
  const joinedRounds = data.get("roundStyle") === "joined";
  const use_abbreviations = !data.get("no-abbreviations");

  try {
    let pattern = generatePattern(circumference, stitch, joinedRounds);

    if (pattern.body.length < 5) {
      showWarning(
        "Warning",
        "Your pattern looks awfully short. I'll display it anyways, "+
        "but make sure to check that the values you entered make sense."
      );
    } else {
      hideWarning();
    }

    // generate array containing the selected list elements
    let pattern_list_elements = []
    if (use_abbreviations) {
      for (const i of pattern.body) {
        pattern_list_elements.push(i.abbrev)
      }
    } else {
      for (const i of pattern.body) {
        pattern_list_elements.push(i.desc)
      }
    }

    document.getElementById("patternTitle").innerHTML = 
      use_abbreviations ? pattern.title.abbrev : pattern.title.desc;
    document.getElementById("patternBody").innerHTML = makeHtmlList(
      pattern_list_elements
    );
  } catch (e) {
    document.getElementById("patternTitle").innerHTML = "";
    document.getElementById("patternBody").innerHTML = "";
    showWarning("Error", e.message);
  }
});

function adjustFontSizes(changeAmount) {
const htmlElement = document.querySelector("html");

htmlElement.style.fontSize = `${parseFloat(getComputedStyle(htmlElement).fontSize) * changeAmount}px`;

current_scale = current_scale * changeAmount;
}
