import allProfanity from "./dist/index.js";

// Check if a string contains allProfanity
console.log(allProfanity.check('This is a clean sentence.'));  // false
allProfanity.check('This is a fucking test.');    // true
allProfanity.check('यह एक चूतिया परीक्षण है।');    // true (Hindi example)
allProfanity.check('Ye ek chutiya test hai.');    // true (Hinglish example)

// Clean allProfanity (character by character replacement)
allProfanity.clean('This is a fucking test.');  
// => "This is a ****ing test."

// Clean allProfanity (whole word replacement)
allProfanity.cleanWithWord('This is a fucking test.');  
// => "This is a *** test.