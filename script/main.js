"use strict";

window.onload = displayCustomStitchInput;

document.querySelector('#stitchSelect').addEventListener("change", displayCustomStitchInput);

// Hide and show the section of the form to input custom stitch
function displayCustomStitchInput() {
    if (document.querySelector('#stitchSelect').value == "custom") {
        document.getElementById("customStitch").style.display = 'block';
        document.getElementById("stWidth").required = true;
        document.getElementById("stHeight").required = true;
    } else {
        document.getElementById("customStitch").style.display = 'none';
        document.getElementById("stWidth").required = false;
        document.getElementById("stHeight").required = false;
    }
}

// On form submit
document.querySelector('#formElem').addEventListener("submit", (e) => {
    e.preventDefault();

    let form = e.target;
    let data = new FormData(form); 

    const stitches = {
        sc: {
            short: "sc",
            name: "single crochet",
            ratio: 5.5/4.5, 
            chainCount: 1,
        },
        hdc: {
            short: "hdc",
            name: "half double crochet",
            ratio: 5.5/7, 
            chainCount: 2,
        },
        dc: {
            short: "dc",
            name: "double crochet",
            ratio: 5.5/10.5, 
            chainCount: 3,
        },
        tr: {
            short: "tr",
            name: "treble crochet",
            ratio: 6.5/15.5, 
            chainCount: 4,
        },
        custom: {
            short: "st",
            name: "a custom stitch (st)",
            ratio: data.get("stWidth")/data.get("stHeight"), 
            chainCount: Math.ceil(data.get("stHeight")/data.get("stWidth")),
        },
    }
    
    const circumference = data.get("circumference");
    const stitch = stitches[data.get("stitch")];

    try {
        let pattern = generatePattern(circumference, stitch);

        if (pattern["body"].length < 4) {
            showWarning("Warning", "Your pattern looks awfully short. I'll display it anyways, but make sure to check that the values you entered make sense.");
        } else {
            hideWarning();
        }
    
        document.getElementById("patternTitle").innerHTML = pattern["title"];
        document.getElementById("patternBody").innerHTML = makeHtmlList(pattern["body"]);
    } catch (e) {
        document.getElementById("patternTitle").innerHTML = "";
        document.getElementById("patternBody").innerHTML = "";
        showWarning("Error", e.message);
    }
});

// Generate the pattern.
// Returns the pattern object that contains the title and the body.
function generatePattern(circumference, stitch) {
    return {
        title: `Crochet pattern for a sphere with a circumference of ${circumference} stitches in ${stitch.name}`,
        body: generatePatternBody(circumference, stitch),
    }
}

// Generate the crochet pattern body. 
// Returns array that contains the pattern body lines.
// If errors occur, displays an error message. In that case, the pattern string may be empty.
function generatePatternBody(circumference, stitch) {
    let patternArray = [];
    let rowCircumferences = calculateRowCircumferences(circumference, stitch);

    let stuffingRow = findStuffingRow(rowCircumferences); 
    let isStuffingRow = false;

    patternArray.push(generateFirstRow(rowCircumferences[0], stitch));

    for (let i = 1; i < rowCircumferences.length; i++) {
        isStuffingRow = (stuffingRow == i);
        patternArray.push(generateMiddleRow(rowCircumferences[i], rowCircumferences[i-1], stitch, isStuffingRow, (i == rowCircumferences.length-1)));
    }

    patternArray.push(generateLastRow(rowCircumferences.length+1 == stuffingRow));

    // let pattern = "";

    if (rowCircumferences.length < 2){
        throw Error(`The circumference you entered is to small to generate a pattern in ${stitch.name}.`);
    } 

    return patternArray;
}

// Calculate the circumferences of all the rows of the sphere for a given sphere circumference and stitch ratio.
// Returns an array of row circumferences.
function calculateRowCircumferences(circumference, stitch) {
    let rowCircumferences = [];

    let s = Math.round(1/4 * circumference * stitch.ratio) // number of rows from top to widest part

    for (let i = 1; i < 2*s; i++) {
        let ns = Math.round(Math.sin(i*Math.PI/(2*s)) * circumference);
        if (ns > 2*rowCircumferences[i-2]) {
            // can not increase more than once in every stitch (technically we can, but let's not do that for now)
            ns = 2*rowCircumferences[i-2];
        } else if(ns < 0.5*rowCircumferences[i-2]) {
            // can not decrease more than two stitches together
            ns = 0.5*rowCircumferences[i-2];
        }
        rowCircumferences.push(ns);
    }

    return rowCircumferences;
}

// Generates the pattern for the first row.
// Returns a string.
function generateFirstRow(rowCircumference, stitch) {
    if (rowCircumference < 3 || rowCircumference == undefined) {
        let message = "The data you entered results in a first row with less than three stitches. Please check the data you entered.";
        if (stitch.short == "st") {
            message += " The wider your custom stitch is, the shorter your first row is going to be.";
        }
        throw new Error(message);
    }
    return `Magic ring, ${rowCircumference} ${stitch.short}, join. Ch ${stitch.chainCount}. (${rowCircumference})`;
}

// Generates the pattern for the last row.
// Returns a string.
function generateLastRow(stuffingRow) {
    if (stuffingRow < 2) {
        return "Stuff the sphere if desired. Weave a thread through all the stitches and pull tight to finish.";
    } 
    return "Finish stuffing the sphere. Weave a thread through all the stitches and pull tight to finish.";
}

// Generates the pattern for any row that is not the first or last.
// Returns a string.
function generateMiddleRow(rowCircumference, prevRowCircumference, stitch, isStuffingRow, isLastRow) {
    if (rowCircumference > prevRowCircumference) {
        return generateIncRow(rowCircumference, prevRowCircumference, stitch);
    } 
    if (rowCircumference < prevRowCircumference) {
        return generateDecRow(rowCircumference, prevRowCircumference, stitch, isStuffingRow, isLastRow);
    }
    return `${capitalizeFirstLetter(stitch.short)} in every stitch. (${rowCircumference})`;
}

// Generates the pattern for an increase row.
// Returns a string.
function generateIncRow(rowCircumference, prevRowCircumference, stitch) {
    let pattern = "";
    if (rowCircumference == 2*prevRowCircumference) {
        pattern += "Inc in every stitch";
    } else {
        let delta = rowCircumference-prevRowCircumference;
        if (Math.floor(prevRowCircumference/delta) < 2) { 
            // more increases than normal stitches, distribute normal stitches
            let repeats = prevRowCircumference - delta;
            let repeatWidth = Math.floor(prevRowCircumference/repeats);
            let tail = prevRowCircumference - repeats*repeatWidth;
            if (repeats > 1) {
                pattern += "*";
            }
            pattern += `${capitalizeFirstLetter(stitch.short)} 1, inc ${repeatWidth-1}`;
            if (repeats > 1) {
                pattern += `* ×${repeats}`;
            }
            if (tail > 0) {
                pattern += `, inc ${tail}`;
            }
        } else { 
            // fewer increases than normal stitches, distribute increases
            let repeatWidth = Math.floor(prevRowCircumference/delta);
            let repeats = delta;
            let tail = prevRowCircumference-repeats*repeatWidth;
            if (repeats > 1) {
                pattern += "*";
            }
            pattern += `${capitalizeFirstLetter(stitch.short)} ${repeatWidth-1}, inc 1`;
            if (repeats > 1) {
                pattern += `* ×${repeats}`;
            }
            if (tail > 0) {
                pattern += `, ${stitch.short} ${tail}`;
            }
        }
    }
    pattern += `, join. Ch ${stitch.chainCount}. (${rowCircumference})`;
    return pattern;
}

// Generates the pattern for a decrease row.
// Returns a string.
function generateDecRow(rowCircumference, prevRowCircumference, stitch, isStuffingRow, isLastRow) {
    let pattern = "";
    if (prevRowCircumference == 2*rowCircumference) {
        pattern += "Dec in every stitch";
    } else {
        let delta = prevRowCircumference-rowCircumference;
        if (Math.floor(rowCircumference/delta) < 2) { 
            // more decreases than normal stitches, distribute normal stitches
            let repeats = rowCircumference - delta;
            let repeatWidth = Math.floor(rowCircumference/repeats);
            let tail = rowCircumference - repeats*repeatWidth;
            if (repeats > 1) {
                pattern += "*";
            }
            pattern += `${capitalizeFirstLetter(stitch.short)} 1, dec ${repeatWidth-1}`;
            if (repeats > 1) {
                pattern += `* ×${repeats}`;
            }
            if (tail > 0) {
                pattern += `, dec ${tail}`;
            }
        } else { 
            // fewer decreases than normal stitches, distribute decreases
            let repeatWidth = Math.floor(rowCircumference/delta);
            let repeats = delta;
            let tail = rowCircumference-repeats*repeatWidth;
            if (repeats > 1) {
                pattern += "*";
            }
            pattern += `${capitalizeFirstLetter(stitch.short)} ${repeatWidth-1}, dec 1`;
            if (repeats > 1) {
                pattern += `* × ${repeats}`;
            }
            if (tail > 0) {
                pattern += `, ${stitch.short} ${tail}`;
            }
        }
    }
    pattern += `, join.`;
    if (!(isLastRow)) {
        pattern += ` Ch ${stitch.chainCount}.`;
    }
    pattern += ` (${rowCircumference})`;
    if (isStuffingRow) {
        pattern += " Lightly stuff the sphere if desired.";
    }
    return pattern;
}

// Capitalizes the first char of a string. Returns the string.
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Calculates the row in which stuffing should be added.
// The stuffing row is the row after 2/3 of the decreases have been worked.
// Returns an integer, which is the number of the stuffing row.
function findStuffingRow(rowCircumferences) {
    let stuffingRow = Math.round(5/6*rowCircumferences.length);
    if (rowCircumferences.length - stuffingRow < 2){
        // The second to last row can not be the stuffing row, because it would end with stuffing the sphere,
        // and the last row would begin with stuffing the sphere.
        // If that would be the case, make the last row the stuffing row.
        stuffingRow = rowCircumferences.length + 1;
    } 
    return stuffingRow;
}

// Turns an array into a string of html list elements.
function makeHtmlList(array) {
    let list = "<li>";
    list += array.join("</li>\n<li>");
    list += "</li>\n";
    return list;
}

// Shows a warning in the crochet pattern. 
// Takes a title (like "Error" or "Warning") and the warning message.
function showWarning(title, warning) {
    let element = document.getElementById("patternWarning");
    element.innerHTML = `<strong>${title}:</strong> `;
    element.innerHTML += warning;
    element.style.display = 'block';
}

// Hides the warning in the crochet pattern
function hideWarning() {
    document.getElementById("patternWarning").style.display = 'none';
}