import { capitalizeFirstLetter, makeHtmlList } from "./modules/helpers.js";
// import { showWarning, hideWarning } from './modules/warning.js';
import {
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
} from "./modules/patternGenerator.js";

document.querySelector("#testButton").addEventListener("click", runTests);

runTests();

function runTests() {
  testHelpers();
  testPatternGenerator();
  displayTestResult("displayTestResult", true, "should display message");
}

// Add fail/success message to HTML
function displayTestResult(testName, success, message) {
  let htmlElement = document.getElementById("testResults");
  let successText = success ? "success" : "fail";
  let result = `<div class=\"${successText}\">${testName}: ${successText} ${
    message ? `(${message})` : ""
  }</div>`;
  htmlElement.innerHTML += result;
}

// Add fail message to HTML if test fails.
// Returns test outcome (boolean).
function displayFailedTest(testName, success, message) {
  if (!success) {
    displayTestResult(testName, success, message);
  }
  return success;
}

function testHelpers() {
  let testSuccessful = true;
  testSuccessful *= displayFailedTest(
    "capitalizeFirstLetter",
    capitalizeFirstLetter("abc") === "Abc",
    "Input: abc"
  );
  testSuccessful *= displayFailedTest(
    "capitalizeFirstLetter",
    capitalizeFirstLetter("") === "",
    "Input: empty string"
  );
  testSuccessful *= displayFailedTest(
    "capitalizeFirstLetter",
    capitalizeFirstLetter("Abc") === "Abc",
    "Input: Abc"
  );

  testSuccessful *= displayFailedTest(
    "makeHtmlList",
    makeHtmlList([]) === "",
    "empty list"
  );
  testSuccessful *= displayFailedTest(
    "makeHtmlList",
    makeHtmlList(["test"]) ===
      '<li>test</li>',
    "one element"
  );
  testSuccessful *= displayFailedTest(
    "makeHtmlList",
    makeHtmlList(["test1", "test2", "test3"]) ===
      '<li>test1</li>' +
        '<li>test2</li>' +
        '<li>test3</li>',
    "three elements"
  );

  displayTestResult("Test helper functions", testSuccessful);
}

function testPatternGenerator() {
  let testSuccessful = true;

  const sc = {
    short: "sc",
    name: "single crochet",
    titleName: "single crochet (sc)",
    ratio: 5.5 / 4.5,
    chainCount: 1,
  };

  const st = {
    short: "st",
    name: "stitch",
    titleName: "custom stitch (st)",
    ratio: 1,
    chainCount: 1,
  };

  // --- Test Pattern Generator ---

  // pattern generator should throw exception
  // if circumference is less than 5 stitches in single crochet
  try {
    generatePattern(4, sc, true);
    displayTestResult(
      "Generate Pattern",
      false,
      "pattern was generated with just 4 stitches, " +
        "error was expected but not thrown"
    );
    testSuccessful = false;
  } catch (e) {
    if (
      e.message !==
      "The circumference you entered is too small " +
        "to generate a pattern in single crochet."
    ) {
      throw e;
    }
  }

  // generate pattern in sc with circumference 5 st (joined rounds)
  let pattern = generatePattern(5, sc, true);
  let patternTestResult = true;
  patternTestResult *=
    pattern.title.abbrev ===
    "Crochet pattern for a sphere with a circumference of 5 stitches " +
      "in single crochet (sc)";
  patternTestResult *=
    pattern.title.desc ===
    "Crochet pattern for a sphere with a circumference of 5 stitches " +
      "in single crochet";
  patternTestResult *= pattern.body.length === 4;
  patternTestResult *=
    pattern.body[0].abbrev === "Magic ring, 4 sc, join. Ch 1. (4)";
  patternTestResult *=
    pattern.body[0].desc ===
    "Magic ring, 4 single crochet, join. Chain 1. 4 stitches total.";
  patternTestResult *= pattern.body[1].abbrev === "3 sc, 1 inc, join. Ch 1. (5)";
  patternTestResult *=
    pattern.body[1].desc ===
    "3 single crochet, 1 increase, join. Chain 1. 5 stitches total.";
  patternTestResult *= pattern.body[2].abbrev === "3 sc, 1 dec, join. (4)";
  patternTestResult *=
    pattern.body[2].desc ===
    "3 single crochet, 1 decrease, join. 4 stitches total.";
  patternTestResult *=
    pattern.body[3].abbrev ===
    "Stuff the sphere if desired. Weave a thread through all the stitches " +
      "and pull tight to finish.";
  patternTestResult *=
    pattern.body[3].desc ===
    "Stuff the sphere if desired. Weave a thread through all the stitches " +
      "and pull tight to finish.";
  testSuccessful *= displayFailedTest(
    "Generate Pattern",
    patternTestResult,
    "pattern in sc with circumference 5, joined rounds"
  );

  // generate pattern in sc with circumference 5 st (continuous rounds)
  pattern = generatePattern(5, sc, false);
  patternTestResult = true;
  patternTestResult *=
    pattern.title.abbrev ===
    "Crochet pattern for a sphere with a circumference of 5 stitches " +
      "in single crochet (sc)";
  patternTestResult *=
    pattern.title.desc ===
    "Crochet pattern for a sphere with a circumference of 5 stitches " +
      "in single crochet";
  patternTestResult *= pattern.body.length === 4;
  patternTestResult *= pattern.body[0].abbrev === "Magic ring, 4 sc. (4)";
  patternTestResult *=
    pattern.body[0].desc === "Magic ring, 4 single crochet. 4 stitches total.";
  patternTestResult *= pattern.body[1].abbrev === "3 sc, 1 inc. (5)";
  patternTestResult *=
    pattern.body[1].desc === "3 single crochet, 1 increase. 5 stitches total.";
  patternTestResult *= pattern.body[2].abbrev === "3 sc, 1 dec. (4)";
  patternTestResult *=
    pattern.body[2].desc === "3 single crochet, 1 decrease. 4 stitches total.";
  patternTestResult *=
    pattern.body[3].abbrev ===
    "Stuff the sphere if desired. Weave a thread through all the stitches " +
      "and pull tight to finish.";
  patternTestResult *=
    pattern.body[3].desc ===
    "Stuff the sphere if desired. Weave a thread through all the stitches " +
      "and pull tight to finish.";
  testSuccessful *= displayFailedTest(
    "Generate Pattern",
    patternTestResult,
    "pattern in sc with circumference 5, continuous rounds"
  );

  // --- Test Pattern Generator Body ---

  // pattern generator should throw exception if circumference
  // is less than 5 stitches in single crochet
  try {
    generatePatternBody(4, sc, true);
    displayTestResult(
      "Generate Pattern Body",
      false,
      "pattern was generated with just 4 stitches, " +
        "error was expected but not thrown"
    );
    testSuccessful = false;
  } catch (e) {
    if (
      e.message !==
      "The circumference you entered is too small to generate a pattern " +
        "in single crochet."
    ) {
      throw e;
    }
  }

  // generate pattern in sc with circumference 5 st (joined rounds)
  let patternBody = generatePatternBody(5, sc, true);
  let patternBodyTestResult = true;
  patternBodyTestResult *= patternBody.length === 4;
  patternBodyTestResult *=
    patternBody[0].abbrev === "Magic ring, 4 sc, join. Ch 1. (4)";
  patternBodyTestResult *=
    patternBody[0].desc ===
    "Magic ring, 4 single crochet, join. Chain 1. 4 stitches total.";
  patternBodyTestResult *= patternBody[1].abbrev === "3 sc, 1 inc, join. Ch 1. (5)";
  patternBodyTestResult *=
    patternBody[1].desc ===
    "3 single crochet, 1 increase, join. Chain 1. 5 stitches total.";
  patternBodyTestResult *= patternBody[2].abbrev === "3 sc, 1 dec, join. (4)";
  patternBodyTestResult *=
    patternBody[2].desc ===
    "3 single crochet, 1 decrease, join. 4 stitches total.";
  patternBodyTestResult *=
    patternBody[3].abbrev ===
    "Stuff the sphere if desired. Weave a thread through all the stitches " +
      "and pull tight to finish.";
  patternBodyTestResult *=
    patternBody[3].desc ===
    "Stuff the sphere if desired. Weave a thread through all the stitches " +
      "and pull tight to finish.";
  testSuccessful *= displayFailedTest(
    "Generate Pattern Body",
    patternBodyTestResult,
    "pattern in sc with circumference 5, joined rounds"
  );

  // generate pattern in sc with circumference 5 st (continuous rounds)
  patternBody = generatePatternBody(5, sc, false);
  patternBodyTestResult = true;
  patternBodyTestResult *= patternBody.length === 4;
  patternBodyTestResult *= patternBody[0].abbrev === "Magic ring, 4 sc. (4)";
  patternBodyTestResult *=
    patternBody[0].desc === "Magic ring, 4 single crochet. 4 stitches total.";
  patternBodyTestResult *= patternBody[1].abbrev === "3 sc, 1 inc. (5)";
  patternBodyTestResult *=
    patternBody[1].desc === "3 single crochet, 1 increase. 5 stitches total.";
  patternBodyTestResult *= patternBody[2].abbrev === "3 sc, 1 dec. (4)";
  patternBodyTestResult *=
    patternBody[2].desc === "3 single crochet, 1 decrease. 4 stitches total.";
  patternBodyTestResult *=
    patternBody[3].abbrev ===
    "Stuff the sphere if desired. Weave a thread through all the stitches " +
      "and pull tight to finish.";
  patternBodyTestResult *=
    patternBody[3].desc ===
    "Stuff the sphere if desired. Weave a thread through all the stitches " +
      "and pull tight to finish.";
  testSuccessful *= displayFailedTest(
    "Generate Pattern Body",
    patternBodyTestResult,
    "pattern in sc with circumference 5, continuous rounds"
  );

  // --- Calculate Row Circumferences ---

  // should throw exception for less than 3 st in sc
  try {
    calculateRowCircumferences(2, sc);
    displayTestResult(
      "Calculate row circumferences",
      false,
      "circumferences were generated with just 2 stitches, " +
        "error was expected but not thrown"
    );
    testSuccessful = false;
  } catch (e) {
    if (
      e.message !==
      "The data you entered results in a first row with less than three " +
        "stitches. Please check the data you entered."
    ) {
      throw e;
    }
  }

  // should throw longer exception for too few stitches in custom stitch
  let customStitch = {
    short: "st",
    name: "stitch",
    TitleName: "a custom stitch (st)",
    ratio: 1 / 1,
    chainCount: 1,
  };
  try {
    calculateRowCircumferences(2, customStitch);
    displayTestResult(
      "Calculate row circumferences - custom stitch",
      false,
      "circumferences were generated with just 2 stitches in custom stitch, " +
        "error was expected but not thrown"
    );
    testSuccessful = false;
  } catch (e) {
    if (
      e.message !==
      "The data you entered results in a first row with less than three " +
        "stitches. Please check the data you entered. The wider your custom " +
        "stitch is, the shorter your first row is going to be."
    ) {
      throw e;
    }
  }

  // for large circumferences, should decrease second value to be at most
  // double as much as the first
  let circumferencesLarge = calculateRowCircumferences(1000, st);
  testSuccessful *= displayFailedTest(
    "Calculate row circumferences",
    circumferencesLarge[0] * 2 === circumferencesLarge[1],
    "Large circumference"
  );

  // should generate pattern for circumferences 3 and 20 in custom stitch
  let circumferences3 = calculateRowCircumferences(3, sc);
  let circumferenceTest = true;
  circumferenceTest *= circumferences3.length === 1;
  circumferenceTest *= circumferences3[0] === 3;
  testSuccessful *= displayFailedTest(
    "Calculate row circumferences",
    circumferenceTest,
    `Result for row circumference (3 st): ${circumferences3}`
  );

  let circumferences20 = calculateRowCircumferences(20, sc);
  let circumferencesExpected = [5, 10, 14, 17, 19, 20, 19, 17, 14, 10, 5];
  circumferenceTest = true;
  circumferenceTest *= circumferences20.length === 11;
  for (let i = 0; i < 11; i++)
    circumferenceTest *= circumferences20[i] === circumferencesExpected[i];
  circumferenceTest *= circumferences20[0] === 5;
  testSuccessful *= displayFailedTest(
    "Calculate row circumferences",
    circumferenceTest,
    `Result for row circumference (20 st): ${circumferences20}`
  );

  // --- Generate First Row ---
  testSuccessful *= displayFailedTest(
    "Generate first row",
    generateFirstRow(42, sc, true).abbrev === "Magic ring, 42 sc, join. Ch 1. (42)",
    "joined rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate first row",
    generateFirstRow(42, sc, true).desc ===
      "Magic ring, 42 single crochet, join. Chain 1. 42 stitches total.",
    "joined rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate first row",
    generateFirstRow(42, sc, false).abbrev === "Magic ring, 42 sc. (42)",
    "continuous rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate first row",
    generateFirstRow(42, sc, false).desc ===
      "Magic ring, 42 single crochet. 42 stitches total.",
    "continuous rounds"
  );

  // --- Generate Last Row ---
  testSuccessful *= displayFailedTest(
    "Generate last row",
    generateLastRow(false).abbrev ===
      "Finish stuffing the sphere. Weave a thread through all the stitches " +
        "and pull tight to finish.",
    "last row isn't stuffing row"
  );
  testSuccessful *= displayFailedTest(
    "Generate last row",
    generateLastRow(false).desc ===
      "Finish stuffing the sphere. Weave a thread through all the stitches " +
        "and pull tight to finish.",
    "last row isn't stuffing row"
  );
  testSuccessful *= displayFailedTest(
    "Generate last row",
    generateLastRow(true).abbrev ===
      "Stuff the sphere if desired. Weave a thread through all the stitches " +
        "and pull tight to finish.",
    "last row is stuffing row"
  );
  testSuccessful *= displayFailedTest(
    "Generate last row",
    generateLastRow(true).desc ===
      "Stuff the sphere if desired. Weave a thread through all the stitches " +
        "and pull tight to finish.",
    "last row is stuffing row"
  );

  // --- Generate Middle Row ---
  testSuccessful *= displayFailedTest(
    "Generate middle row",
    generateMiddleRow(16, 13, sc, false, false, true).abbrev ===
      "*3 sc, 1 inc* ×3, 1 sc, join. Ch 1. (16)",
    "increase row, joined rows"
  );
  testSuccessful *= displayFailedTest(
    "Generate middle row",
    generateMiddleRow(16, 13, sc, false, false, true).desc ===
      "3 single crochet, 1 increase. Repeat from beginning of row 3 times, " +
        "1 single crochet, join. Chain 1. 16 stitches total.",
    "increase row, joined rows, description"
  );
  testSuccessful *= displayFailedTest(
    "Generate middle row",
    generateMiddleRow(13, 16, sc, false, false, true).abbrev ===
      "*3 sc, 1 dec* ×3, 1 sc, join. Ch 1. (13)",
    "decrease row, joined rows"
  );
  testSuccessful *= displayFailedTest(
    "Generate middle row",
    generateMiddleRow(13, 16, sc, false, false, true).desc ===
      "3 single crochet, 1 decrease. Repeat from beginning of row 3 times, " +
        "1 single crochet, join. Chain 1. 13 stitches total.",
    "decrease row, joined rows, description"
  );
  testSuccessful *= displayFailedTest(
    "Generate middle row",
    generateMiddleRow(10, 10, sc, false, false, true).abbrev ===
      "Sc in every stitch, join. Ch 1. (10)",
    "no increases or decreases, joined rows"
  );
  testSuccessful *= displayFailedTest(
    "Generate middle row",
    generateMiddleRow(10, 10, sc, false, false, true).desc ===
      "Single crochet in every stitch, join. Chain 1. 10 stitches total.",
    "no increases or decreases, joined rows, description"
  );
  testSuccessful *= displayFailedTest(
    "Generate middle row",
    generateMiddleRow(16, 13, sc, false, false, false).abbrev ===
      "*3 sc, 1 inc* ×3, 1 sc. (16)",
    "increase row, continuous rows"
  );
  testSuccessful *= displayFailedTest(
    "Generate middle row",
    generateMiddleRow(16, 13, sc, false, false, false).desc ===
      "3 single crochet, 1 increase. Repeat from beginning of row 3 times, " +
        "1 single crochet. 16 stitches total.",
    "increase row, continuous rows, description"
  );
  testSuccessful *= displayFailedTest(
    "Generate middle row",
    generateMiddleRow(13, 16, sc, false, false, false).abbrev ===
      "*3 sc, 1 dec* ×3, 1 sc. (13)",
    "decrease row, continuous rows"
  );
  testSuccessful *= displayFailedTest(
    "Generate middle row",
    generateMiddleRow(13, 16, sc, false, false, false).desc ===
      "3 single crochet, 1 decrease. Repeat from beginning of row 3 times, " +
        "1 single crochet. 13 stitches total.",
    "decrease row, continuous rows, description"
  );
  testSuccessful *= displayFailedTest(
    "Generate middle row",
    generateMiddleRow(10, 10, sc, false, false, false).abbrev ===
      "Sc in every stitch. (10)",
    "no increases or decreases, continuous rows"
  );
  testSuccessful *= displayFailedTest(
    "Generate middle row",
    generateMiddleRow(10, 10, sc, false, false, false).desc ===
      "Single crochet in every stitch. 10 stitches total.",
    "no increases or decreases, continuous rows, description"
  );

  // --- Generate Increase Row ---
  testSuccessful *= displayFailedTest(
    "Generate increase row",
    generateIncRow(10, 5, sc, true).abbrev ===
      "Inc in every stitch, join. Ch 1. (10)",
    "all increases, joined rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate increase row",
    generateIncRow(10, 5, sc, true).desc ===
      "Increase in every stitch, join. Chain 1. 10 stitches total.",
    "all increases, joined rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate increase row",
    generateIncRow(16, 10, sc, true).abbrev ===
      "*1 sc, 1 inc* ×4, 2 inc, join. Ch 1. (16)",
    "more inc than normal st, joined rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate increase row",
    generateIncRow(16, 10, sc, true).desc ===
      "1 single crochet, 1 increase. Repeat from beginning of row 4 times, " +
        "2 increase, join. Chain 1. 16 stitches total.",
    "more inc than normal st, joined rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate increase row",
    generateIncRow(16, 13, sc, true).abbrev ===
      "*3 sc, 1 inc* ×3, 1 sc, join. Ch 1. (16)",
    "fewer inc than normal st, joined rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate increase row",
    generateIncRow(16, 13, sc, true).desc ===
      "3 single crochet, 1 increase. Repeat from beginning of row 3 times, " +
        "1 single crochet, join. Chain 1. 16 stitches total.",
    "fewer inc than normal st, joined rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate increase row",
    generateIncRow(10, 5, sc, false).abbrev === "Inc in every stitch. (10)",
    "all increases, continuous rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate increase row",
    generateIncRow(10, 5, sc, false).desc ===
      "Increase in every stitch. 10 stitches total.",
    "all increases, continuous rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate increase row",
    generateIncRow(16, 10, sc, false).abbrev === "*1 sc, 1 inc* ×4, 2 inc. (16)",
    "more inc than normal st, continuous rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate increase row",
    generateIncRow(16, 10, sc, false).desc ===
      "1 single crochet, 1 increase. Repeat from beginning of row 4 times, " +
        "2 increase. 16 stitches total.",
    "more inc than normal st, continuous rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate increase row",
    generateIncRow(16, 13, sc, false).abbrev === "*3 sc, 1 inc* ×3, 1 sc. (16)",
    "fewer inc than normal st, continuous rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate increase row",
    generateIncRow(16, 13, sc, false).desc ===
      "3 single crochet, 1 increase. Repeat from beginning of row 3 times, " +
        "1 single crochet. 16 stitches total.",
    "fewer inc than normal st, continuous rounds"
  );

  // --- Generate Decrease Row ---
  testSuccessful *= displayFailedTest(
    "Generate decrease row",
    generateDecRow(5, 10, sc, false, false, true).abbrev ===
      "Dec in every stitch, join. Ch 1. (5)",
    "all decreases, joined rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate decrease row",
    generateDecRow(5, 10, sc, false, false, true).desc ===
      "Decrease in every stitch, join. Chain 1. 5 stitches total.",
    "all decreases, joined rounds, description"
  );
  testSuccessful *= displayFailedTest(
    "Generate decrease row",
    generateDecRow(10, 16, sc, false, false, true).abbrev ===
      "*1 sc, 1 dec* ×4, 2 dec, join. Ch 1. (10)",
    "more dec than normal st, joined rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate decrease row",
    generateDecRow(10, 16, sc, false, false, true).desc ===
      "1 single crochet, 1 decrease. Repeat from beginning of row 4 times, " +
        "2 decrease, join. Chain 1. 10 stitches total.",
    "more dec than normal st, joined rounds, description"
  );
  testSuccessful *= displayFailedTest(
    "Generate decrease row",
    generateDecRow(13, 16, sc, false, false, true).abbrev ===
      "*3 sc, 1 dec* ×3, 1 sc, join. Ch 1. (13)",
    "fewer dec than normal st, joined rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate decrease row",
    generateDecRow(13, 16, sc, false, false, true).desc ===
      "3 single crochet, 1 decrease. Repeat from beginning of row 3 times, " +
        "1 single crochet, join. Chain 1. 13 stitches total.",
    "fewer dec than normal st, joined rounds, description"
  );
  testSuccessful *= displayFailedTest(
    "Generate decrease row",
    generateDecRow(13, 16, sc, false, true, true).abbrev ===
      "*3 sc, 1 dec* ×3, 1 sc, join. (13)",
    "is last row, joined rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate decrease row",
    generateDecRow(13, 16, sc, false, true, true).desc ===
      "3 single crochet, 1 decrease. Repeat from beginning of row 3 times, " +
        "1 single crochet, join. 13 stitches total.",
    "is last row, joined rounds, description"
  );
  testSuccessful *= displayFailedTest(
    "Generate decrease row",
    generateDecRow(13, 16, sc, true, false, true).abbrev ===
      "*3 sc, 1 dec* ×3, 1 sc, join. Ch 1. (13) Lightly stuff the sphere " +
        "if desired.",
    "is stuffing row, joined rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate decrease row",
    generateDecRow(13, 16, sc, true, false, true).desc ===
      "3 single crochet, 1 decrease. Repeat from beginning of row 3 times, " +
        "1 single crochet, join. Chain 1. 13 stitches total. Lightly stuff " +
        "the sphere if desired.",
    "is stuffing row, joined rounds, description"
  );
  testSuccessful *= displayFailedTest(
    "Generate decrease row",
    generateDecRow(5, 10, sc, false, false, false).abbrev ===
      "Dec in every stitch. (5)",
    "all decreases, continuous rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate decrease row",
    generateDecRow(5, 10, sc, false, false, false).desc ===
      "Decrease in every stitch. 5 stitches total.",
    "all decreases, continuous rounds, description"
  );
  testSuccessful *= displayFailedTest(
    "Generate decrease row",
    generateDecRow(10, 16, sc, false, false, false).abbrev ===
      "*1 sc, 1 dec* ×4, 2 dec. (10)",
    "more dec than normal st, continuous rounds, description"
  );
  testSuccessful *= displayFailedTest(
    "Generate decrease row",
    generateDecRow(10, 16, sc, false, false, false).desc ===
      "1 single crochet, 1 decrease. Repeat from beginning of row 4 times, " +
        "2 decrease. 10 stitches total.",
    "more dec than normal st, continuous rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate decrease row",
    generateDecRow(13, 16, sc, false, false, false).abbrev ===
      "*3 sc, 1 dec* ×3, 1 sc. (13)",
    "fewer dec than normal st, continuous rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate decrease row",
    generateDecRow(13, 16, sc, false, false, false).desc ===
      "3 single crochet, 1 decrease. Repeat from beginning of row 3 times, " +
        "1 single crochet. 13 stitches total.",
    "fewer dec than normal st, continuous rounds, description"
  );
  testSuccessful *= displayFailedTest(
    "Generate decrease row",
    generateDecRow(13, 16, sc, false, true, false).abbrev ===
      "*3 sc, 1 dec* ×3, 1 sc. (13)",
    "is last row, continuous rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate decrease row",
    generateDecRow(13, 16, sc, false, true, false).desc ===
      "3 single crochet, 1 decrease. Repeat from beginning of row 3 times, " +
        "1 single crochet. 13 stitches total.",
    "is last row, continuous rounds, description"
  );
  testSuccessful *= displayFailedTest(
    "Generate decrease row",
    generateDecRow(13, 16, sc, true, false, false).abbrev ===
      "*3 sc, 1 dec* ×3, 1 sc. (13) Lightly stuff the sphere if desired.",
    "is stuffing row, continuous rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate decrease row",
    generateDecRow(13, 16, sc, true, false, false).desc ===
      "3 single crochet, 1 decrease. Repeat from beginning of row 3 times, " +
        "1 single crochet. 13 stitches total. Lightly stuff the sphere " +
        "if desired.",
    "is stuffing row, continuous rounds, description"
  );

  // --- Generate Straight Row ---
  testSuccessful *= displayFailedTest(
    "Generate straight row",
    generateStraightRow(10, sc, false, false, true).abbrev ===
      "Sc in every stitch, join. Ch 1. (10)",
    "not stuffing row, not last row, joined rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate straight row",
    generateStraightRow(10, sc, false, false, true).desc ===
      "Single crochet in every stitch, join. Chain 1. 10 stitches total.",
    "not stuffing row, not last row, joined rounds, description"
  );
  testSuccessful *= displayFailedTest(
    "Generate straight row",
    generateStraightRow(10, sc, true, false, true).abbrev ===
      "Sc in every stitch, join. Ch 1. (10) Lightly stuff the sphere " +
        "if desired.",
    "stuffing row, joined rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate straight row",
    generateStraightRow(10, sc, true, false, true).desc ===
      "Single crochet in every stitch, join. Chain 1. 10 stitches total. " +
        "Lightly stuff the sphere if desired.",
    "stuffing row, joined rounds, description"
  );
  testSuccessful *= displayFailedTest(
    "Generate straight row",
    generateStraightRow(10, sc, false, true, true).abbrev ===
      "Sc in every stitch, join. (10)",
    "last row, joined rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate straight row",
    generateStraightRow(10, sc, false, true, true).desc ===
      "Single crochet in every stitch, join. 10 stitches total.",
    "last row, joined rounds, description"
  );
  testSuccessful *= displayFailedTest(
    "Generate straight row",
    generateStraightRow(10, sc, false, false, false).abbrev ===
      "Sc in every stitch. (10)",
    "not stuffing row, not last row, continuous rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate straight row",
    generateStraightRow(10, sc, false, false, false).desc ===
      "Single crochet in every stitch. 10 stitches total.",
    "not stuffing row, not last row, continuous rounds, description"
  );
  testSuccessful *= displayFailedTest(
    "Generate straight row",
    generateStraightRow(10, sc, true, false, false).abbrev ===
      "Sc in every stitch. (10) Lightly stuff the sphere if desired.",
    "stuffing row, continuous rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate straight row",
    generateStraightRow(10, sc, true, false, false).desc ===
      "Single crochet in every stitch. 10 stitches total. Lightly stuff the " +
        "sphere if desired.",
    "stuffing row, continuous rounds, description"
  );
  testSuccessful *= displayFailedTest(
    "Generate straight row",
    generateStraightRow(10, sc, false, true, false).abbrev ===
      "Sc in every stitch. (10)",
    "last row, continuous rounds"
  );
  testSuccessful *= displayFailedTest(
    "Generate straight row",
    generateStraightRow(10, sc, false, true, false).desc ===
      "Single crochet in every stitch. 10 stitches total.",
    "last row, continuous rounds, description"
  );

  // --- findStuffingRow ---
  let circumferencesShort = [1, 2, 3, 4, 5, 4, 3, 2, 1];
  let circumferencesLong = [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1];

  testSuccessful *= displayFailedTest(
    "Calculate stuffing row",
    findStuffingRow(circumferencesShort) === 9,
    "short pattern, last row is stuffing row"
  );
  testSuccessful *= displayFailedTest(
    "Calculate stuffing row",
    findStuffingRow(circumferencesLong) === 9,
    "longer pattern, last row isn't stuffing row"
  );

  displayTestResult("Test pattern generator", testSuccessful);
}
