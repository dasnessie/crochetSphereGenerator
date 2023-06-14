import { capitalizeFirstLetter, makeHtmlList } from './modules/helpers.js';
// import { showWarning, hideWarning } from './modules/warning.js';
import { generatePattern, generatePatternBody, calculateRowCircumferences, generateFirstRow, generateLastRow, findStuffingRow, generateIncRow, generateDecRow, generateMiddleRow, generateStraightRow } from './modules/patternGenerator.js';

document.querySelector('#testButton').addEventListener("click", runTests);

runTests();

function runTests(){
    testHelpers();
    testPatternGenerator();
    displayTestResult("displayTestResult", true, "should display message");
}

// Add fail/success message to HTML
function displayTestResult(testName, success, message) {
    let htmlElement = document.getElementById("testResults");
    let successText = success ? "success" : "fail";
    let result = `<div class=\"${successText}\">${testName}: ${successText} ${message ? `(${message})` : ""}</div>`;
    htmlElement.innerHTML += result;
}

// Add fail message to HTML if test fails. 
// Returns test outcome (boolean).
function displayFailedTest(testName, success, message) {
    if (!(success)) {
        displayTestResult(testName, success, message);
    }
    return success;
}

function testHelpers() {
    let testSuccessful = true;
    testSuccessful *= displayFailedTest("capitalizeFirstLetter", capitalizeFirstLetter("abc") === "Abc", "Input: abc");
    testSuccessful *= displayFailedTest("capitalizeFirstLetter", capitalizeFirstLetter("") === "", "Input: empty string");
    testSuccessful *= displayFailedTest("capitalizeFirstLetter", capitalizeFirstLetter("Abc") === "Abc", "Input: Abc");
    
    testSuccessful *= displayFailedTest("makeHtmlList", makeHtmlList([]) === "", "empty list");
    testSuccessful *= displayFailedTest("makeHtmlList", makeHtmlList(["test"]) === "<li>test</li>", "one element");
    testSuccessful *= displayFailedTest("makeHtmlList", makeHtmlList(["test1","test2","test3"]) === "<li>test1</li><li>test2</li><li>test3</li>", "three elements");

    displayTestResult("Test helper functions", testSuccessful);
}

function testPatternGenerator () {
    let testSuccessful = true;

    const sc = {
        short: "sc",
        name: "single crochet",
        ratio: 5.5/4.5, 
        chainCount: 1,
    }

    const st = {
        short: "st",
        name: "custom stitch",
        ratio: 1,
        chainCount: 1,
    }

    // --- Test Pattern Generator ---

    // pattern generator should throw exception 
    // if circumference is less than 5 stitches in single crochet
    try {
        generatePattern(4, sc);
        displayTestResult("Generate Pattern", false, "pattern was generated with just 4 stitches, error was expected but not thrown");
        testSuccessful = false;
    } catch (e) {
        if (e.message !== "The circumference you entered is too small to generate a pattern in single crochet.") {
            throw e;
        }
    }

    // generate pattern in sc with circumference 5 st
    let pattern = generatePattern(5, sc);
    let patternTestResult = true;
    patternTestResult *= pattern.title === "Crochet pattern for a sphere with a circumference of 5 stitches in single crochet"
    patternTestResult *= pattern.body.length === 4;
    patternTestResult *= pattern.body[0] === "Magic ring, 4 sc, join. Ch 1. (4)";
    patternTestResult *= pattern.body[1] === "Sc 3, inc 1, join. Ch 1. (5)";
    patternTestResult *= pattern.body[2] === "Sc 3, dec 1, join. (4)";
    patternTestResult *= pattern.body[3] === "Stuff the sphere if desired. Weave a thread through all the stitches and pull tight to finish.";
    testSuccessful *= displayFailedTest("Generate Pattern", patternTestResult, "pattern in sc with circumference 5");

    // --- Test Pattern Generator Body ---

    // pattern generator should throw exception if circumference 
    // is less than 5 stitches in single crochet
    try {
        generatePatternBody(4, sc);
        displayTestResult("Generate Pattern Body", false, "pattern was generated with just 4 stitches, error was expected but not thrown");
        testSuccessful = false;
    } catch (e) {
        if (e.message !== "The circumference you entered is too small to generate a pattern in single crochet.") {
            throw e;
        }
    }

    // generate pattern in sc with circumference 5 st
    let patternBody = generatePatternBody(5, sc);
    let patternBodyTestResult = true;
    patternBodyTestResult *= patternBody.length === 4;
    patternBodyTestResult *= patternBody[0] === "Magic ring, 4 sc, join. Ch 1. (4)";
    patternBodyTestResult *= patternBody[1] === "Sc 3, inc 1, join. Ch 1. (5)";
    patternBodyTestResult *= patternBody[2] === "Sc 3, dec 1, join. (4)";
    patternBodyTestResult *= patternBody[3] === "Stuff the sphere if desired. Weave a thread through all the stitches and pull tight to finish.";
    testSuccessful *= displayFailedTest("Generate Pattern Body", patternBodyTestResult, "pattern in sc with circumference 5");

    // --- Calculate Row Circumferences ---

    // should throw exception for less than 3 st in sc
    try {
        calculateRowCircumferences(2, sc);
        displayTestResult("Calculate row circumferences", false, "circumferences were generated with just 2 stitches, error was expected but not thrown");
        testSuccessful = false;
    } catch (e) {
        if (e.message !== "The data you entered results in a first row with less than three stitches. Please check the data you entered.") {
            throw e;
        }
    }

    // should throw longer exception for too few stitches in custom stitch
    let customStitch = {
        short: "st",
        name: "a custom stitch (st)",
        ratio: 1/1, 
        chainCount: 1,
    }
    try {
        calculateRowCircumferences(2, customStitch);
        displayTestResult("Calculate row circumferences - custom stitch", false, "circumferences were generated with just 2 stitches in custom stitch, error was expected but not thrown");
        testSuccessful = false;
    } catch (e) {
        if (e.message !== "The data you entered results in a first row with less than three stitches. Please check the data you entered. The wider your custom stitch is, the shorter your first row is going to be.") {
            throw e;
        }
    }

    // for large circumferences, should decrease second value to be at most 
    // double as much as the first
    let circumferencesLarge = calculateRowCircumferences(1000, st);
    testSuccessful *= displayFailedTest("Calculate row circumferences", circumferencesLarge[0] * 2 === circumferencesLarge[1], "Large circumference");
    
    // should generate pattern for circumferences 3 and 20 in custom stitch
    let circumferences3 = calculateRowCircumferences(3, sc);
    let circumferenceTest = true;
    circumferenceTest *= circumferences3.length === 1;
    circumferenceTest *= circumferences3[0] === 3;
    testSuccessful *= displayFailedTest("Calculate row circumferences", circumferenceTest, `Result for row circumference (3 st): ${circumferences3}`);

    let circumferences20 = calculateRowCircumferences(20, sc);
    let circumferencesExpected = [5,10,14,17,19,20,19,17,14,10,5];
    circumferenceTest = true;
    circumferenceTest *= circumferences20.length === 11;
    for (let i = 0; i < 11; i++) 
        circumferenceTest *= circumferences20[i] === circumferencesExpected[i];
    circumferenceTest *= circumferences20[0] === 5;
    testSuccessful *= displayFailedTest("Calculate row circumferences", circumferenceTest, `Result for row circumference (20 st): ${circumferences20}`);

    // --- Generate First Row ---
    testSuccessful *= displayFailedTest("Generate first row", generateFirstRow(42, sc) === "Magic ring, 42 sc, join. Ch 1. (42)");
    
    // --- Generate Last Row ---
    testSuccessful *= displayFailedTest("Generate last row", generateLastRow(false) === "Finish stuffing the sphere. Weave a thread through all the stitches and pull tight to finish.", "last row isn't stuffing row");
    testSuccessful *= displayFailedTest("Generate last row", generateLastRow(true) === "Stuff the sphere if desired. Weave a thread through all the stitches and pull tight to finish.", "last row is stuffing row");

    // --- Generate Middle Row ---
    testSuccessful *= displayFailedTest("Generate middle row", generateMiddleRow(16, 13, sc, false, false) ===  "*Sc 3, inc 1* ×3, sc 1, join. Ch 1. (16)", "increase row");
    testSuccessful *= displayFailedTest("Generate middle row", generateMiddleRow(13, 16, sc, false, false) === "*Sc 3, dec 1* ×3, sc 1, join. Ch 1. (13)", "decrease row");
    testSuccessful *= displayFailedTest("Generate middle row", generateMiddleRow(10, 10, sc, false, false) === "Sc in every stitch, join. Ch 1. (10)", "no increases or decreases");

    // --- Generate Increase Row ---
    testSuccessful *= displayFailedTest("Generate increase row", generateIncRow(10, 5, sc) === "Inc in every stitch, join. Ch 1. (10)", "all increases");
    testSuccessful *= displayFailedTest("Generate increase row", generateIncRow(16, 10, sc) === "*Sc 1, inc 1* ×4, inc 2, join. Ch 1. (16)", "more inc than normal st");
    testSuccessful *= displayFailedTest("Generate increase row", generateIncRow(16, 13, sc) === "*Sc 3, inc 1* ×3, sc 1, join. Ch 1. (16)", "fewer inc than normal st");

    // --- Generate Decrease Row ---
    testSuccessful *= displayFailedTest("Generate decrease row", generateDecRow(5, 10, sc, false, false) === "Dec in every stitch, join. Ch 1. (5)", "all decreases");
    testSuccessful *= displayFailedTest("Generate decrease row", generateDecRow(10, 16, sc, false, false) === "*Sc 1, dec 1* ×4, dec 2, join. Ch 1. (10)", "more dec than normal st");
    testSuccessful *= displayFailedTest("Generate decrease row", generateDecRow(13, 16, sc, false, false) === "*Sc 3, dec 1* ×3, sc 1, join. Ch 1. (13)", "fewer dec than normal st");
    testSuccessful *= displayFailedTest("Generate decrease row", generateDecRow(13, 16, sc, false, true) === "*Sc 3, dec 1* ×3, sc 1, join. (13)", "is last row");
    testSuccessful *= displayFailedTest("Generate decrease row", generateDecRow(13, 16, sc, true, false) === "*Sc 3, dec 1* ×3, sc 1, join. Ch 1. (13) Lightly stuff the sphere if desired.", "is stuffing row");
    
    // --- Generate Straight Row ---
    testSuccessful *= displayFailedTest("Generate straight row", generateStraightRow(10, sc, false, false) === "Sc in every stitch, join. Ch 1. (10)", "not stuffing row, not last row");
    testSuccessful *= displayFailedTest("Generate straight row", generateStraightRow(10, sc, true, false) === "Sc in every stitch, join. Ch 1. (10) Lightly stuff the sphere if desired.", "stuffing row");
    testSuccessful *= displayFailedTest("Generate straight row", generateStraightRow(10, sc, false, true) === "Sc in every stitch. (10)", "last row");

    // --- findStuffingRow ---
    let circumferencesShort = [1, 2, 3, 4, 5, 4, 3, 2, 1];
    let circumferencesLong = [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1];

    testSuccessful *= displayFailedTest("Calculate stuffing row", findStuffingRow(circumferencesShort) === 9, "short pattern, last row is stuffing row");
    testSuccessful *= displayFailedTest("Calculate stuffing row", findStuffingRow(circumferencesLong) === 9, "longer pattern, last row isn't stuffing row");

    displayTestResult("Test pattern generator", testSuccessful);
}