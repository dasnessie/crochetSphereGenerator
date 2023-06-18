import { capitalizeFirstLetter } from "./helpers.js";

// Generate the pattern.
// Returns the pattern object that contains the title and the body.
function generatePattern(circumference, stitch, joinedRounds) {
  return {
    title:
      `Crochet pattern for a sphere with a circumference of ` +
      `${circumference} stitches in ${stitch.titleName}`,
    body: generatePatternBody(circumference, stitch, joinedRounds),
  };
}

// Generate the crochet pattern body.
// Returns array that contains the pattern body lines.
function generatePatternBody(circumference, stitch, joinedRounds) {
  let patternArray = [];
  let rowCircumferences = calculateRowCircumferences(circumference, stitch);

  let stuffingRow = findStuffingRow(rowCircumferences);
  let isStuffingRow = false;

  patternArray.push(
    generateFirstRow(rowCircumferences[0], stitch, joinedRounds)
  );

  for (let i = 1; i < rowCircumferences.length; i++) {
    isStuffingRow = stuffingRow == i;
    patternArray.push(
      generateMiddleRow(
        rowCircumferences[i],
        rowCircumferences[i - 1],
        stitch,
        isStuffingRow,
        i == rowCircumferences.length - 1,
        joinedRounds
      )
    );
  }

  patternArray.push(generateLastRow(rowCircumferences.length == stuffingRow));

  if (rowCircumferences.length < 2) {
    throw Error(
      `The circumference you entered is too small to generate a pattern ` +
        `in ${stitch.name}.`
    );
  }

  return patternArray;
}

// Calculate the circumferences of all the rows of the sphere for a given sphere
// circumference and stitch ratio.
// Returns an array of row circumferences. If a row is shorter than three
// stitches, throws an error.
function calculateRowCircumferences(circumference, stitch) {
  let rowCircumferences = [];

  // number of rows from top to widest part
  let s = Math.round((1 / 4) * circumference * stitch.ratio);

  for (let i = 1; i < 2 * s; i++) {
    let ns = Math.round(Math.sin((i * Math.PI) / (2 * s)) * circumference);
    if (ns > 2 * rowCircumferences[i - 2]) {
      // can not increase more than once in every stitch
      ns = 2 * rowCircumferences[i - 2];
    } else if (ns < 0.5 * rowCircumferences[i - 2]) {
      // can not decrease more than two stitches together
      ns = 0.5 * rowCircumferences[i - 2];
    }
    if (ns < 3 || ns == undefined) {
      let message =
        "The data you entered results in a first row with less than three " +
        "stitches. Please check the data you entered.";
      if (stitch.short == "st") {
        message +=
          " The wider your custom stitch is, the shorter your first row is " +
          "going to be.";
      }
      throw new Error(message);
    }
    rowCircumferences.push(ns);
  }

  return rowCircumferences;
}

// Generates the pattern for the first row.
// Returns an array containing two strings: The list item and it's description.
function generateFirstRow(rowCircumference, stitch, joinedRounds) {
  let pattern = `Magic ring, ${rowCircumference} ${stitch.short}`;
  let description = `Magic ring, ${rowCircumference} ${stitch.name}`;
  if (joinedRounds) {
    pattern += `, join. Ch ${stitch.chainCount}`;
    description += `, join. Chain ${stitch.chainCount}`;
  }
  pattern += `. (${rowCircumference})`;
  description += `. ${rowCircumference} stitches total.`;
  return [pattern, description];
}

// Generates the pattern for the last row.
// Returns a string.
function generateLastRow(stuffingRow) {
  if (stuffingRow) {
    let pattern =
      "Stuff the sphere if desired. Weave a thread through all the stitches " +
      "and pull tight to finish.";
    return [pattern, pattern];
  }
  let pattern =
    "Finish stuffing the sphere. Weave a thread through all the stitches and " +
    "pull tight to finish.";
  return [pattern, pattern];
}

// Generates the pattern for any row that is not the first or last.
// Returns an array containing two strings: The pattern, and the description.
function generateMiddleRow(
  rowCircumference,
  prevRowCircumference,
  stitch,
  isStuffingRow,
  isLastRow,
  joinedRounds
) {
  if (rowCircumference > prevRowCircumference) {
    return generateIncRow(
      rowCircumference,
      prevRowCircumference,
      stitch,
      joinedRounds
    );
  }
  if (rowCircumference < prevRowCircumference) {
    return generateDecRow(
      rowCircumference,
      prevRowCircumference,
      stitch,
      isStuffingRow,
      isLastRow,
      joinedRounds
    );
  }
  return generateStraightRow(
    rowCircumference,
    stitch,
    isStuffingRow,
    isLastRow,
    joinedRounds
  );
}

function generateStraightRow(
  rowCircumference,
  stitch,
  isStuffingRow,
  isLastRow,
  joinedRounds
) {
  let pattern = `${capitalizeFirstLetter(stitch.short)} in every stitch`;
  let description = `${capitalizeFirstLetter(stitch.name)} in every stitch`;
  if (joinedRounds) {
    pattern += ", join";
    description += ", join";
    if (!isLastRow) {
      pattern += `. Ch ${stitch.chainCount}`;
      description += `. Chain ${stitch.chainCount}`;
    }
  }
  pattern += `. (${rowCircumference})`;
  description += `. ${rowCircumference} stitches total.`;
  if (isStuffingRow) {
    pattern += " Lightly stuff the sphere if desired.";
    description += " Lightly stuff the sphere if desired.";
  }
  return [pattern, description];
}

// Generates the pattern for an increase row.
// Returns a an array containing two strings: the pattern and the description.
function generateIncRow(
  rowCircumference,
  prevRowCircumference,
  stitch,
  joinedRounds
) {
  let pattern = "";
  let description = "";
  if (rowCircumference > 2 * prevRowCircumference) {
    throw Error(
      "Can not generate increase row: row more than twice as long as previous"
    );
  }
  if (rowCircumference == 2 * prevRowCircumference) {
    pattern += "Inc in every stitch";
    description += "Increase in every stitch";
  } else {
    let delta = rowCircumference - prevRowCircumference;
    if (Math.floor(prevRowCircumference / delta) < 2) {
      // more increases than normal stitches, distribute normal stitches
      let repeats = prevRowCircumference - delta;
      let repeatWidth = Math.floor(prevRowCircumference / repeats);
      let tail = prevRowCircumference - repeats * repeatWidth;
      if (repeats > 1) {
        pattern += "*";
      }
      pattern += `1 ${stitch.short}, ${repeatWidth - 1} inc`;
      description += `1 ${stitch.name}, ${repeatWidth - 1} increase`;
      if (repeats > 1) {
        pattern += `* ×${repeats}`;
        description += `. Repeat from beginning of row ${repeats} times`;
      }
      if (tail > 0) {
        pattern += `, ${tail} inc`;
        description += `, ${tail} increase`;
      }
    } else {
      // fewer increases than normal stitches, distribute increases
      let repeatWidth = Math.floor(prevRowCircumference / delta);
      let repeats = delta;
      let tail = prevRowCircumference - repeats * repeatWidth;
      if (repeats > 1) {
        pattern += "*";
      }
      pattern += `${repeatWidth - 1} ${stitch.short}, 1 inc`;
      description += `${repeatWidth - 1} ${stitch.name}, 1 increase`;
      if (repeats > 1) {
        pattern += `* ×${repeats}`;
        description += `. Repeat from beginning of row ${repeats} times`;
      }
      if (tail > 0) {
        pattern += `, ${tail} ${stitch.short}`;
        description += `, ${tail} ${stitch.name}`;
      }
    }
  }
  if (joinedRounds) {
    pattern += `, join. Ch ${stitch.chainCount}`;
    description += `, join. Chain ${stitch.chainCount}`;
  }
  pattern += `. (${rowCircumference})`;
  description += `. ${rowCircumference} stitches total.`;
  return [pattern, description];
}

// Generates the pattern for a decrease row.
// Returns a an array containing two strings: the pattern and the description.
function generateDecRow(
  rowCircumference,
  prevRowCircumference,
  stitch,
  isStuffingRow,
  isLastRow,
  joinedRounds
) {
  let pattern = "";
  let description = "";
  if (prevRowCircumference == 2 * rowCircumference) {
    pattern += "Dec in every stitch";
    description += "Decrease in every stitch";
  } else {
    let delta = prevRowCircumference - rowCircumference;
    if (Math.floor(rowCircumference / delta) < 2) {
      // more decreases than normal stitches, distribute normal stitches
      let repeats = rowCircumference - delta;
      let repeatWidth = Math.floor(rowCircumference / repeats);
      let tail = rowCircumference - repeats * repeatWidth;
      if (repeats > 1) {
        pattern += "*";
      }
      pattern += `1 ${stitch.short}, ${repeatWidth - 1} dec`;
      description += `1 ${stitch.name}, ${repeatWidth - 1} decrease`;
      if (repeats > 1) {
        pattern += `* ×${repeats}`;
        description += `. Repeat from beginning of row ${repeats} times`;
      }
      if (tail > 0) {
        pattern += `, ${tail} dec`;
        description += `, ${tail} decrease`;
      }
    } else {
      // fewer decreases than normal stitches, distribute decreases
      let repeatWidth = Math.floor(rowCircumference / delta);
      let repeats = delta;
      let tail = rowCircumference - repeats * repeatWidth;
      if (repeats > 1) {
        pattern += "*";
      }
      pattern += `${repeatWidth - 1} ${stitch.short}, 1 dec`;
      description += `${repeatWidth - 1} ${stitch.name}, 1 decrease`;
      if (repeats > 1) {
        pattern += `* ×${repeats}`;
        description += `. Repeat from beginning of row ${repeats} times`;
      }
      if (tail > 0) {
        pattern += `, ${tail} ${stitch.short}`;
        description += `, ${tail} ${stitch.name}`;
      }
    }
  }
  if (joinedRounds) {
    pattern += ", join";
    description += ", join";
    if (!isLastRow) {
      pattern += `. Ch ${stitch.chainCount}`;
      description += `. Chain ${stitch.chainCount}`;
    }
  }
  pattern += `. (${rowCircumference})`;
  description += `. ${rowCircumference} stitches total.`;
  if (isStuffingRow) {
    pattern += " Lightly stuff the sphere if desired.";
    description += " Lightly stuff the sphere if desired.";
  }
  return [pattern, description];
}

// Calculates the row in which stuffing should be added.
// The stuffing row is the row after 2/3 of the decreases have been worked.
// Returns an integer, which is the number of the stuffing row.
function findStuffingRow(rowCircumferences) {
  let stuffingRow = Math.round((5 / 6) * rowCircumferences.length);
  if (rowCircumferences.length - stuffingRow < 2) {
    // The second to last row can not be the stuffing row, because it would end
    // with stuffing the sphere, and the last row would begin with stuffing the
    // sphere.
    // If that would be the case, make the last row the stuffing row.
    stuffingRow = rowCircumferences.length;
  }
  return stuffingRow;
}

export {
  generatePattern,
  generatePatternBody,
  calculateRowCircumferences,
  generateFirstRow,
  generateLastRow,
  findStuffingRow,
  generateIncRow,
  generateDecRow,
  generateMiddleRow,
  generateStraightRow,
};
